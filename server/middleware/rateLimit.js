import { extractClientIp } from './ipExtractor.js';

/**
 * Creates an in-memory rate limiter middleware
 * @param {number} windowMs - Time window in milliseconds
 * @param {number} maxRequests - Maximum requests permitted per IP per window
 * @param {string} message - Error message returned when limit exceeded
 */
export function createRateLimiter({ windowMs = 60 * 1000, maxRequests = 60, message = 'Rate limit exceeded. Please try again later.' }) {
  const store = new Map();

  // Periodic garbage collection every 5 minutes to prevent memory leak
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of store.entries()) {
      if (now > record.resetTime) {
        store.delete(key);
      }
    }
  }, 5 * 60 * 1000).unref();

  return (req, res, next) => {
    const ip = extractClientIp(req);
    const now = Date.now();

    let record = store.get(ip);
    if (!record || now > record.resetTime) {
      record = {
        count: 1,
        resetTime: now + windowMs
      };
      store.set(ip, record);
    } else {
      record.count += 1;
    }

    const remaining = Math.max(0, maxRequests - record.count);
    const retryAfter = Math.ceil((record.resetTime - now) / 1000);

    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', remaining);
    res.setHeader('X-RateLimit-Reset', Math.ceil(record.resetTime / 1000));

    if (record.count > maxRequests) {
      res.setHeader('Retry-After', retryAfter);
      return res.status(429).json({
        error: message,
        retryAfterSeconds: retryAfter
      });
    }

    next();
  };
}

// Ingestion rate limit: 120 events / min per IP
export const ingestionLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 120,
  message: 'Too many analytics events. Ingestion throttled.'
});

// Auth brute-force protection: 10 attempts / 15 minutes per IP
export const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 10,
  message: 'Too many login attempts. Please wait 15 minutes before trying again.'
});
