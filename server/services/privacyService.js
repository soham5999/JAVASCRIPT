import crypto from 'node:crypto';
import { dbRepo } from '../db.js';

// Rotating daily salt for pseudonymized hashing to prevent cross-day tracking
let currentSalt = crypto.randomBytes(16).toString('hex');
let lastSaltDate = new Date().toISOString().slice(0, 10);

function getDailySalt() {
  const today = new Date().toISOString().slice(0, 10);
  if (today !== lastSaltDate) {
    currentSalt = crypto.randomBytes(16).toString('hex');
    lastSaltDate = today;
  }
  return currentSalt;
}

/**
 * Clean and normalize an IP address string
 */
export function normalizeIp(rawIp) {
  if (!rawIp || typeof rawIp !== 'string') return '127.0.0.1';
  let ip = rawIp.trim();
  // Strip IPv4 mapped IPv6 prefix
  if (ip.startsWith('::ffff:')) {
    ip = ip.replace('::ffff:', '');
  }
  if (ip === '::1') {
    ip = '127.0.0.1';
  }
  return ip;
}

/**
 * Checks if an IP is in a private, loopback, or reserved range
 */
export function isPrivateIp(ip) {
  if (!ip) return true;
  const clean = normalizeIp(ip);
  if (clean === '127.0.0.1' || clean === 'localhost') return true;

  // IPv4 Private blocks: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 169.254.0.0/16, 100.64.0.0/10
  const parts = clean.split('.').map(Number);
  if (parts.length === 4 && !parts.some(isNaN)) {
    if (parts[0] === 10) return true;
    if (parts[0] === 127) return true;
    if (parts[0] === 192 && parts[1] === 168) return true;
    if (parts[0] === 169 && parts[1] === 254) return true;
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
    if (parts[0] === 100 && parts[1] >= 64 && parts[1] <= 127) return true;
  }

  // IPv6 loopback / unique local (fc00::/7) / link-local (fe80::/10)
  if (clean.includes(':')) {
    const lower = clean.toLowerCase();
    if (lower === '::1' || lower.startsWith('fc') || lower.startsWith('fd') || lower.startsWith('fe80')) {
      return true;
    }
  }

  return false;
}

/**
 * Truncate an IP address (e.g. 192.168.1.100 -> 192.168.1.xxx)
 */
export function truncateIp(ip) {
  const clean = normalizeIp(ip);
  if (clean.includes('.')) {
    const parts = clean.split('.');
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.${parts[2]}.xxx`;
    }
  } else if (clean.includes(':')) {
    const parts = clean.split(':');
    return `${parts.slice(0, 3).join(':')}:xxxx:xxxx:xxxx`;
  }
  return 'xxx.xxx.xxx.xxx';
}

/**
 * Pseudonymize an IP using HMAC-SHA256 with rotating salt
 * Note: Hashed IPs are labeled "pseudonymized" rather than "anonymous"
 */
export function pseudonymizeIp(ip) {
  const clean = normalizeIp(ip);
  const salt = getDailySalt();
  const hmac = crypto.createHmac('sha256', salt);
  hmac.update(clean);
  const hash = hmac.digest('hex').substring(0, 16);
  return `pseudo_${hash}`;
}

/**
 * Processes client IP based on privacy configuration and user consent
 */
export function processIpForStorage(rawIp) {
  const cleanIp = normalizeIp(rawIp);
  const settings = dbRepo.getAllSettings();
  const collectRaw = settings.collect_raw_ip === 'true' || settings.collect_raw_ip === true;
  const anonymizeMode = settings.anonymize_mode || 'truncate';

  if (collectRaw) {
    return {
      ip_address: cleanIp,
      ip_mode: 'raw'
    };
  }

  if (anonymizeMode === 'hash') {
    return {
      ip_address: pseudonymizeIp(cleanIp),
      ip_mode: 'pseudonymized'
    };
  }

  // Default: truncate
  return {
    ip_address: truncateIp(cleanIp),
    ip_mode: 'truncated'
  };
}

/**
 * Check browser privacy signals (DNT / GPC)
 */
export function shouldHonorPrivacyHeader(req) {
  const respectDnt = dbRepo.getSetting('respect_dnt') === 'true';
  if (!respectDnt) return false;

  const dnt = req.headers['dnt'];
  const gpc = req.headers['sec-gpc'];

  return dnt === '1' || gpc === '1';
}
