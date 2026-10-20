import { Router } from 'express';
import { dbRepo } from '../db.js';
import { ingestionLimiter } from '../middleware/rateLimit.js';
import { extractClientIp } from '../middleware/ipExtractor.js';
import { processIpForStorage, shouldHonorPrivacyHeader } from '../services/privacyService.js';
import { lookupGeoLocation } from '../services/geoService.js';
import { parseDeviceAndBrowser } from '../services/deviceService.js';

const router = Router();

/**
 * Sanitizes page path: strips sensitive query params, ensures starts with /
 */
function sanitizePath(rawPath) {
  if (!rawPath || typeof rawPath !== 'string') return '/';
  try {
    // If it is a full URL or path with query params
    const dummyBase = 'https://local.dummy';
    const parsed = new URL(rawPath.startsWith('/') ? `${dummyBase}${rawPath}` : `${dummyBase}/${rawPath}`);
    // Only keep clean pathname + hash if present, NEVER query parameters that might carry PII
    let clean = parsed.pathname;
    if (parsed.hash) {
      // Clean hash without sensitive query strings
      clean += parsed.hash.split('?')[0];
    }
    return clean.substring(0, 500);
  } catch {
    return rawPath.split('?')[0].substring(0, 500);
  }
}

/**
 * Sanitizes referrer: keeps origin or clean path, never query parameters
 */
function sanitizeReferrer(rawReferrer) {
  if (!rawReferrer || typeof rawReferrer !== 'string') return 'Direct';
  try {
    const parsed = new URL(rawReferrer);
    // Return hostname + clean pathname, discarding any tokens/query strings
    return `${parsed.protocol}//${parsed.hostname}${parsed.pathname}`.substring(0, 500);
  } catch {
    return rawReferrer.split('?')[0].substring(0, 500);
  }
}

/**
 * POST /api/analytics/collect
 * Secure, rate-limited public ingestion endpoint
 */
router.post('/collect', ingestionLimiter, async (req, res) => {
  try {
    // Respect Global Privacy Control (GPC) / Do Not Track (DNT) if enabled
    if (shouldHonorPrivacyHeader(req)) {
      const consent = req.body?.consent;
      if (consent !== true) {
        return res.status(200).json({ success: true, ignored: 'dnt_respected' });
      }
    }

    const {
      path: rawPath,
      referrer: rawReferrer,
      visitorId,
      sessionId,
      screen,
      language
    } = req.body || {};

    // Validate essential fields
    if (!visitorId || typeof visitorId !== 'string') {
      return res.status(400).json({ error: 'Valid pseudonymous visitorId is required.' });
    }

    const cleanVisitorId = visitorId.trim().substring(0, 128);
    const cleanSessionId = (sessionId && typeof sessionId === 'string') 
      ? sessionId.trim().substring(0, 128) 
      : cleanVisitorId;

    const path = sanitizePath(rawPath);
    const referrer = sanitizeReferrer(rawReferrer);

    // 1. Extract IP address safely (anti-spoofing)
    const clientIp = extractClientIp(req);

    // 2. Perform coarse geolocation on the server
    const geo = lookupGeoLocation(clientIp);

    // 3. Parse user-agent safely
    const ua = req.headers['user-agent'] || '';
    const device = parseDeviceAndBrowser(ua, screen);

    // 4. Process IP address according to privacy & retention settings
    const { ip_address, ip_mode } = processIpForStorage(clientIp);

    // 5. Check if visitor is new or returning
    const hasVisited = dbRepo.hasVisitorVisitedBefore(cleanVisitorId);
    const visitType = hasVisited ? 'returning' : 'new';

    // 6. Record event
    const now = new Date();
    dbRepo.recordPageView({
      visitor_id: cleanVisitorId,
      session_id: cleanSessionId,
      path,
      referrer,
      ip_address,
      ip_mode,
      country: geo.country,
      country_name: geo.country_name,
      region: geo.region,
      city: geo.city,
      is_approximate: geo.is_approximate ? 1 : 0,
      device_type: device.deviceType,
      browser: device.browser,
      os: device.os,
      screen_category: device.screenCategory,
      visit_type: visitType,
      timestamp_utc: now.toISOString(),
      created_at_epoch: now.getTime()
    });

    return res.status(200).json({
      success: true,
      mode: ip_mode
    });
  } catch (err) {
    console.error('Analytics ingestion error:', err);
    return res.status(500).json({ error: 'Failed to record event.' });
  }
});

export default router;
