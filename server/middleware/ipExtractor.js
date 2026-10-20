import { dbRepo } from '../db.js';
import { normalizeIp } from '../services/privacyService.js';

/**
 * Extracts client IP securely
 * Trusts forwarded-IP headers only when configured to trust proxy
 * Prevents header spoofing attacks
 */
export function extractClientIp(req) {
  const isTrustProxy = 
    process.env.TRUST_PROXY === 'true' || 
    dbRepo.getSetting('trust_proxy') === 'true';

  let resolvedIp = '';

  if (isTrustProxy) {
    // When behind a verified reverse proxy (e.g., Cloudflare, Nginx, Vercel)
    const forwarded = req.headers['x-forwarded-for'];
    if (forwarded) {
      // The first address in X-Forwarded-For is the original client
      const list = String(forwarded).split(',');
      resolvedIp = list[0].trim();
    } else if (req.headers['cf-connecting-ip']) {
      resolvedIp = req.headers['cf-connecting-ip'];
    } else if (req.headers['x-real-ip']) {
      resolvedIp = req.headers['x-real-ip'];
    } else {
      resolvedIp = req.ip || req.socket.remoteAddress;
    }
  } else {
    // Do NOT trust X-Forwarded-For blindly when not behind a verified proxy
    resolvedIp = req.socket.remoteAddress || req.ip || '127.0.0.1';
  }

  return normalizeIp(resolvedIp);
}
