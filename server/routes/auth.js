import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { dbRepo } from '../db.js';
import { generateToken, requireAdminAuth } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimit.js';

const router = Router();

/**
 * POST /api/auth/login
 * Authenticates admin credentials, returns JWT and sets HttpOnly cookie
 */
router.post('/login', authLimiter, async (req, res) => {
  try {
    const { username, password } = req.body || {};

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    const admin = dbRepo.getAdminByUsername(username.trim());
    if (!admin) {
      // Mitigate timing attacks with a dummy compare
      await bcrypt.compare(password, '$2a$10$abcdefghijklmnopqrstuvwxyz123456');
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    // Update last login timestamp
    dbRepo.updateAdminLastLogin(admin.id);

    const token = generateToken(admin);

    // Set secure HttpOnly cookie
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('ag_admin_token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 12 * 60 * 60 * 1000 // 12 hours
    });

    return res.json({
      success: true,
      token,
      user: {
        id: admin.id,
        username: admin.username,
        role: admin.role,
        last_login: admin.last_login
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error during authentication.' });
  }
});

/**
 * GET /api/auth/me
 * Returns current authenticated admin session
 */
router.get('/me', requireAdminAuth, (req, res) => {
  return res.json({
    authenticated: true,
    user: req.user
  });
});

/**
 * POST /api/auth/logout
 * Clears authentication cookie
 */
router.post('/logout', (req, res) => {
  res.clearCookie('ag_admin_token');
  return res.json({ success: true, message: 'Logged out successfully.' });
});

/**
 * POST /api/auth/change-password
 * Allows the authenticated admin to change their password
 */
router.post('/change-password', requireAdminAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body || {};

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Both current and new passwords are required.' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters long.' });
    }

    const admin = dbRepo.getAdminById(req.user.id);
    const fullUser = dbRepo.getAdminByUsername(admin.username);

    const isMatch = await bcrypt.compare(currentPassword, fullUser.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Current password does not match.' });
    }

    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(newPassword, salt);

    dbRepo.updateAdminPassword(req.user.id, newHash);

    return res.json({ success: true, message: 'Password updated successfully.' });
  } catch (err) {
    console.error('Change password error:', err);
    return res.status(500).json({ error: 'Failed to update password.' });
  }
});

export default router;
