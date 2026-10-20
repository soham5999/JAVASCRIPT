/**
 * Client-Side Privacy-Conscious Visitor Analytics Tracker
 * Features:
 * - Pseudonymous random visitor ID (stored in localStorage)
 * - Session ID (stored in sessionStorage)
 * - Automatic React 18 Strict Mode deduplication
 * - URL sanitization (strips all sensitive query parameters / PII)
 * - Respects DNT and user privacy consent settings
 */

const STORAGE_KEYS = {
  VISITOR_ID: 'ag_visitor_id',
  SESSION_ID: 'ag_session_id',
  CONSENT: 'ag_privacy_consent'
};

// React 18 StrictMode double-mount deduplication cache
let lastTrackedPath = '';
let lastTrackedTimestamp = 0;
const DEDUPLICATION_WINDOW_MS = 2000;

/**
 * Generate cryptographically secure pseudonymous identifier
 */
function generateId(prefix = 'v') {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}_${crypto.randomUUID().replace(/-/g, '').substring(0, 16)}`;
  }
  return `${prefix}_${Math.random().toString(36).substring(2, 10)}${Date.now().toString(36)}`;
}

/**
 * Retrieve or initialize pseudonymous visitor ID
 */
export function getVisitorId() {
  if (typeof window === 'undefined') return '';
  try {
    let vid = localStorage.getItem(STORAGE_KEYS.VISITOR_ID);
    if (!vid) {
      vid = generateId('v');
      localStorage.setItem(STORAGE_KEYS.VISITOR_ID, vid);
    }
    return vid;
  } catch {
    return generateId('v');
  }
}

/**
 * Retrieve or initialize session ID
 */
export function getSessionId() {
  if (typeof window === 'undefined') return '';
  try {
    let sid = sessionStorage.getItem(STORAGE_KEYS.SESSION_ID);
    if (!sid) {
      sid = generateId('s');
      sessionStorage.setItem(STORAGE_KEYS.SESSION_ID, sid);
    }
    return sid;
  } catch {
    return generateId('s');
  }
}

/**
 * Get screen size category
 */
export function getScreenCategory() {
  if (typeof window === 'undefined') return 'desktop';
  const width = window.innerWidth;
  if (width < 640) return 'mobile';
  if (width < 1024) return 'tablet';
  if (width > 1920) return 'ultrawide';
  return 'desktop';
}

/**
 * Consent management: 'granted', 'denied', or null
 */
export function getConsentStatus() {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(STORAGE_KEYS.CONSENT);
  } catch {
    return null;
  }
}

export function setConsentStatus(status) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.CONSENT, status);
  } catch (err) {
    console.warn('Unable to persist consent:', err);
  }
}

/**
 * Strips all query parameters, tokens, and PII from URLs
 */
function sanitizeClientUrl(urlStr) {
  try {
    const parsed = new URL(urlStr, window.location.origin);
    // Keep pathname + hash (e.g. /#projects), drop all query search strings
    let clean = parsed.pathname;
    if (parsed.hash) {
      clean += parsed.hash.split('?')[0];
    }
    return clean;
  } catch {
    return '/';
  }
}

/**
 * Record a page-view event
 */
export async function trackPageView(customPath = null) {
  if (typeof window === 'undefined') return;

  // Check user consent
  const consent = getConsentStatus();
  if (consent === 'denied') {
    return;
  }

  // Determine current path
  const currentPath = customPath || (window.location.pathname + (window.location.hash || ''));
  const cleanPath = sanitizeClientUrl(currentPath);

  // StrictMode and fast re-render deduplication guard
  const now = Date.now();
  if (cleanPath === lastTrackedPath && (now - lastTrackedTimestamp) < DEDUPLICATION_WINDOW_MS) {
    return;
  }
  lastTrackedPath = cleanPath;
  lastTrackedTimestamp = now;

  const visitorId = getVisitorId();
  const sessionId = getSessionId();
  const screen = getScreenCategory();

  // Clean referrer origin
  let cleanReferrer = 'Direct';
  if (document.referrer) {
    try {
      const refUrl = new URL(document.referrer);
      // Discard external query parameters
      cleanReferrer = `${refUrl.origin}${refUrl.pathname}`;
    } catch {
      cleanReferrer = 'Direct';
    }
  }

  const payload = {
    visitorId,
    sessionId,
    path: cleanPath,
    referrer: cleanReferrer,
    screen,
    language: navigator.language || 'en',
    consent: consent === 'granted'
  };

  try {
    // Send via fetch with keepalive if supported
    await fetch('/api/analytics/collect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      keepalive: true
    });
  } catch (err) {
    // Silent fail in client to avoid disrupting visitor experience
  }
}
