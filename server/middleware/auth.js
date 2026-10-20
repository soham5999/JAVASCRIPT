import jwt from 'jsonwebtoken';
import { dbRepo } from '../db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'antigravity_super_secret_jwt_key_2026_change_in_prod';

/**
 * Generates a signed JWT token for admin session
 */
export function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role || 'admin'
    },
    JWT_SECRET,
    { expiresIn: '12h' }
  );
}

/**
 * Middleware that strictly protects admin routes
 * Enforces server-side authentication and role-based access control
 */
export function requireAdminAuth(req, res, next) {
  let token = null;

  // 1. Check Authorization Bearer header
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  }

  // 2. Check HttpOnly cookie
  if (!token && req.cookies && req.cookies.ag_admin_token) {
    token = req.cookies.ag_admin_token;
  }

  if (!token) {
    return res.status(401).json({
      error: 'Authentication required. No session token provided.'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Verify user still exists in database
    const user = dbRepo.getAdminById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'Session expired or user deleted.' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden. Administrator privileges required.' });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Session expired. Please log in again.' });
    }
    return res.status(401).json({ error: 'Invalid or forged authentication token.' });
  }
}
