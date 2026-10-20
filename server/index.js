import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

import { dbRepo } from './db.js';
import authRoutes from './routes/auth.js';
import analyticsRoutes from './routes/analytics.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Security settings
const isTrustProxy = process.env.TRUST_PROXY === 'true' || dbRepo.getSetting('trust_proxy') === 'true';
if (isTrustProxy) {
  app.set('trust proxy', 1);
}

// Security Headers Middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
});

// Middleware configuration
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || true,
  credentials: true
}));
app.use(cookieParser());
app.use(express.json({ limit: '64kb' })); // Small limit prevents injection / DDoS memory exhaustion

// Health check (supports both /api/health and /health)
app.get(['/api/health', '/health'], (req, res) => {
  res.json({
    status: 'ok',
    system: 'Antigravity Analytics Backend',
    environment: process.env.VERCEL ? 'vercel-serverless' : (process.env.NODE_ENV || 'development'),
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes (supports both with and without /api prefix for Vercel serverless rewrites)
app.use(['/api/auth', '/auth'], authRoutes);
app.use(['/api/analytics', '/analytics'], analyticsRoutes);
app.use(['/api/admin', '/admin'], adminRoutes);

// In Production, serve Vite build assets from dist/
const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath) && !process.env.VERCEL) {
  app.use(express.static(distPath));

  // SPA fallback for HTML5 history API (e.g. /admin/analytics)
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/auth') || req.path.startsWith('/analytics') || req.path.startsWith('/admin')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Auto-seed default admin if no admin accounts exist
export async function ensureAdminExists() {
  try {
    const adminCount = dbRepo.getAdminCount();
    if (adminCount === 0) {
      const defaultUser = process.env.ADMIN_USERNAME || 'admin';
      const defaultPass = process.env.ADMIN_PASSWORD || 'antigravity2026!';
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(defaultPass, salt);
      dbRepo.createAdmin(defaultUser, hash, 'admin');
      console.log(`\n======================================================`);
      console.log(`🔑 INITIAL ADMIN CREATED:`);
      console.log(`   Username: ${defaultUser}`);
      console.log(`   Password: ${defaultPass}`);
      console.log(`   ⚠️ Change this immediately in Settings / .env`);
      console.log(`======================================================\n`);
    }
  } catch (err) {
    console.error('Failed to initialize admin user:', err);
  }
}

// Retention cleanup scheduler: run once on start and every 24 hours
export function scheduleRetentionCleanup() {
  try {
    const result = dbRepo.cleanupExpiredEvents();
    if (result.deletedCount > 0) {
      console.log(`🧹 Retention cleanup purged ${result.deletedCount} expired records.`);
    }
  } catch (err) {
    console.error('Startup cleanup error:', err);
  }

  // Every 24 hours (only in persistent server environments)
  if (!process.env.VERCEL) {
    setInterval(() => {
      try {
        const result = dbRepo.cleanupExpiredEvents();
        if (result.deletedCount > 0) {
          console.log(`🧹 Retention cleanup purged ${result.deletedCount} expired records.`);
        }
      } catch (err) {
        console.error('Scheduled cleanup error:', err);
      }
    }, 24 * 60 * 60 * 1000).unref();
  }
}

// Initialize admin account
ensureAdminExists().catch(console.error);

// Only bind TCP port when running standalone (not in Vercel serverless)
if (!process.env.VERCEL) {
  scheduleRetentionCleanup();
  app.listen(PORT, () => {
    console.log(`🌌 Antigravity Analytics Server running on port ${PORT}`);
    console.log(`📊 Ingestion endpoint: http://localhost:${PORT}/api/analytics/collect`);
    console.log(`🛡️ Admin API: http://localhost:${PORT}/api/admin/overview`);
  });
}

export default app;

