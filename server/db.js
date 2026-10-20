import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure data directory exists (uses /tmp on Vercel serverless environment)
const dbDir = process.env.ANALYTICS_DB_DIR || (process.env.VERCEL ? '/tmp' : path.join(__dirname, '..', 'data'));
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = process.env.ANALYTICS_DB_PATH || path.join(dbDir, 'analytics.db');
const db = new DatabaseSync(dbPath);

// Enable WAL mode for high concurrency
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA synchronous = NORMAL;');

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    created_at TEXT NOT NULL,
    last_login TEXT
  );

  CREATE TABLE IF NOT EXISTS analytics_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS page_views (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    visitor_id TEXT NOT NULL,
    session_id TEXT NOT NULL,
    path TEXT NOT NULL,
    referrer TEXT,
    ip_address TEXT,
    ip_mode TEXT DEFAULT 'anonymized',
    country TEXT,
    country_name TEXT,
    region TEXT,
    city TEXT,
    is_approximate INTEGER DEFAULT 1,
    device_type TEXT,
    browser TEXT,
    os TEXT,
    screen_category TEXT,
    visit_type TEXT DEFAULT 'new',
    timestamp_utc TEXT NOT NULL,
    created_at_epoch INTEGER NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_page_views_created_epoch ON page_views(created_at_epoch);
  CREATE INDEX IF NOT EXISTS idx_page_views_visitor_id ON page_views(visitor_id);
  CREATE INDEX IF NOT EXISTS idx_page_views_session_id ON page_views(session_id);
  CREATE INDEX IF NOT EXISTS idx_page_views_path ON page_views(path);
  CREATE INDEX IF NOT EXISTS idx_page_views_country ON page_views(country);
  CREATE INDEX IF NOT EXISTS idx_page_views_device ON page_views(device_type);
`);

// Seed default settings if not exists
const defaultSettings = [
  ['collect_raw_ip', 'false'],
  ['retention_days', '60'],
  ['anonymize_mode', 'truncate'],
  ['trust_proxy', 'false'],
  ['respect_dnt', 'true']
];

const insertSettingStmt = db.prepare(`
  INSERT OR IGNORE INTO analytics_settings (key, value, updated_at) 
  VALUES (?, ?, ?)
`);

const nowIso = new Date().toISOString();
for (const [key, val] of defaultSettings) {
  insertSettingStmt.run(key, val, nowIso);
}

// Export repository operations
export const dbRepo = {
  rawDb: db,

  // Settings
  getSetting(key) {
    const row = db.prepare('SELECT value FROM analytics_settings WHERE key = ?').get(key);
    return row ? row.value : null;
  },

  getAllSettings() {
    const rows = db.prepare('SELECT key, value, updated_at FROM analytics_settings').all();
    const result = {};
    for (const row of rows) {
      result[row.key] = row.value;
    }
    return result;
  },

  setSetting(key, value) {
    const stmt = db.prepare(`
      INSERT INTO analytics_settings (key, value, updated_at) 
      VALUES (?, ?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
    `);
    stmt.run(key, String(value), new Date().toISOString());
  },

  // Admin users
  getAdminByUsername(username) {
    return db.prepare('SELECT * FROM admin_users WHERE username = ?').get(username);
  },

  getAdminById(id) {
    return db.prepare('SELECT id, username, role, created_at, last_login FROM admin_users WHERE id = ?').get(id);
  },

  getAdminCount() {
    const row = db.prepare('SELECT COUNT(*) as count FROM admin_users').get();
    return row.count;
  },

  createAdmin(username, passwordHash, role = 'admin') {
    const stmt = db.prepare(`
      INSERT INTO admin_users (username, password_hash, role, created_at)
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(username, passwordHash, role, new Date().toISOString());
    return result;
  },

  updateAdminPassword(id, newHash) {
    const stmt = db.prepare('UPDATE admin_users SET password_hash = ? WHERE id = ?');
    return stmt.run(newHash, id);
  },

  updateAdminLastLogin(id) {
    const stmt = db.prepare('UPDATE admin_users SET last_login = ? WHERE id = ?');
    return stmt.run(new Date().toISOString(), id);
  },

  // Page views ingestion
  hasVisitorVisitedBefore(visitorId) {
    const row = db.prepare('SELECT id FROM page_views WHERE visitor_id = ? LIMIT 1').get(visitorId);
    return Boolean(row);
  },

  recordPageView(event) {
    const stmt = db.prepare(`
      INSERT INTO page_views (
        visitor_id, session_id, path, referrer, ip_address, ip_mode,
        country, country_name, region, city, is_approximate,
        device_type, browser, os, screen_category, visit_type,
        timestamp_utc, created_at_epoch
      ) VALUES (
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?
      )
    `);

    const result = stmt.run(
      event.visitor_id,
      event.session_id,
      event.path,
      event.referrer || '',
      event.ip_address || '',
      event.ip_mode || 'anonymized',
      event.country || 'Unknown',
      event.country_name || 'Unknown',
      event.region || '',
      event.city || '',
      event.is_approximate ? 1 : 0,
      event.device_type || 'unknown',
      event.browser || 'Unknown',
      event.os || 'Unknown',
      event.screen_category || 'desktop',
      event.visit_type || 'new',
      event.timestamp_utc,
      event.created_at_epoch
    );

    return result;
  },

  // Overview metrics
  getOverviewMetrics() {
    const now = Date.now();
    const todayStartEpoch = new Date().setHours(0, 0, 0, 0);
    const last30MinEpoch = now - (30 * 60 * 1000);

    const totalViewsRow = db.prepare('SELECT COUNT(*) as count FROM page_views').get();
    const uniqueVisitorsRow = db.prepare('SELECT COUNT(DISTINCT visitor_id) as count FROM page_views').get();
    const visitorsTodayRow = db.prepare('SELECT COUNT(DISTINCT visitor_id) as count FROM page_views WHERE created_at_epoch >= ?').get(todayStartEpoch);
    const activeVisitorsLast30Row = db.prepare('SELECT COUNT(DISTINCT visitor_id) as count FROM page_views WHERE created_at_epoch >= ?').get(last30MinEpoch);
    
    // Top page section
    const topSectionRow = db.prepare(`
      SELECT path, COUNT(*) as count 
      FROM page_views 
      GROUP BY path 
      ORDER BY count DESC 
      LIMIT 1
    `).get();

    // Top referrer
    const topReferrerRow = db.prepare(`
      SELECT referrer, COUNT(*) as count 
      FROM page_views 
      WHERE referrer IS NOT NULL AND referrer != '' AND referrer != 'Direct'
      GROUP BY referrer 
      ORDER BY count DESC 
      LIMIT 1
    `).get();

    return {
      totalViews: totalViewsRow.count || 0,
      uniqueVisitors: uniqueVisitorsRow.count || 0,
      visitorsToday: visitorsTodayRow.count || 0,
      activeVisitorsLast30Min: activeVisitorsLast30Row.count || 0,
      topSection: topSectionRow ? topSectionRow.path : 'Home (/)',
      topReferrer: topReferrerRow ? topReferrerRow.referrer : 'Direct / Organic'
    };
  },

  // Daily traffic trends (last N days)
  getDailyTrends(days = 14) {
    const now = Date.now();
    const startEpoch = now - (days * 24 * 60 * 60 * 1000);

    // Group by date substring from timestamp_utc (YYYY-MM-DD)
    const rows = db.prepare(`
      SELECT 
        substr(timestamp_utc, 1, 10) as date,
        COUNT(*) as views,
        COUNT(DISTINCT visitor_id) as uniques
      FROM page_views
      WHERE created_at_epoch >= ?
      GROUP BY date
      ORDER BY date ASC
    `).all(startEpoch);

    return rows;
  },

  // Popular pages
  getPopularPages(limit = 10) {
    return db.prepare(`
      SELECT path, COUNT(*) as views, COUNT(DISTINCT visitor_id) as unique_visitors
      FROM page_views
      GROUP BY path
      ORDER BY views DESC
      LIMIT ?
    `).all(limit);
  },

  // Device & OS breakdown
  getDeviceBreakdown() {
    const devices = db.prepare(`
      SELECT device_type, COUNT(*) as count
      FROM page_views
      GROUP BY device_type
      ORDER BY count DESC
    `).all();

    const browsers = db.prepare(`
      SELECT browser, COUNT(*) as count
      FROM page_views
      GROUP BY browser
      ORDER BY count DESC
      LIMIT 6
    `).all();

    const os = db.prepare(`
      SELECT os, COUNT(*) as count
      FROM page_views
      GROUP BY os
      ORDER BY count DESC
      LIMIT 6
    `).all();

    return { devices, browsers, os };
  },

  // Real-time activity (active visitors strictly defined as active within last 5 minutes)
  getRealtimeActivity(windowMinutes = 5) {
    const now = Date.now();
    const cutoff = now - (windowMinutes * 60 * 1000);

    const activeVisitorsRow = db.prepare(`
      SELECT COUNT(DISTINCT visitor_id) as count 
      FROM page_views 
      WHERE created_at_epoch >= ?
    `).get(cutoff);

    const viewsInWindowRow = db.prepare(`
      SELECT COUNT(*) as count 
      FROM page_views 
      WHERE created_at_epoch >= ?
    `).get(cutoff);

    // Recent 25 page views
    const recentEvents = db.prepare(`
      SELECT 
        id, visitor_id, session_id, path, referrer, ip_address, ip_mode,
        country, country_name, city, is_approximate, device_type, browser, os,
        visit_type, timestamp_utc, created_at_epoch
      FROM page_views
      ORDER BY created_at_epoch DESC
      LIMIT 25
    `).all();

    return {
      activeVisitors: activeVisitorsRow.count || 0,
      viewsInWindow: viewsInWindowRow.count || 0,
      windowMinutes,
      serverTimeUtc: new Date().toISOString(),
      recentEvents
    };
  },

  // Searchable, sortable, paginated visitor logs
  getVisitorLogs({
    limit = 20,
    offset = 0,
    search = '',
    sortBy = 'created_at_epoch',
    sortOrder = 'DESC',
    country = '',
    device = '',
    page = '',
    referrer = '',
    visitType = '',
    startDate = '',
    endDate = ''
  }) {
    const safeSortCols = [
      'created_at_epoch', 'timestamp_utc', 'path', 'country', 
      'device_type', 'browser', 'os', 'visit_type', 'ip_address'
    ];
    const col = safeSortCols.includes(sortBy) ? sortBy : 'created_at_epoch';
    const order = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const conditions = [];
    const params = [];

    if (search && search.trim() !== '') {
      conditions.push(`(
        path LIKE ? OR 
        country LIKE ? OR 
        country_name LIKE ? OR 
        city LIKE ? OR 
        browser LIKE ? OR 
        os LIKE ? OR 
        ip_address LIKE ? OR
        visitor_id LIKE ?
      )`);
      const term = `%${search.trim()}%`;
      params.push(term, term, term, term, term, term, term, term);
    }

    if (country) {
      conditions.push('country = ?');
      params.push(country);
    }

    if (device) {
      conditions.push('device_type = ?');
      params.push(device);
    }

    if (page) {
      conditions.push('path = ?');
      params.push(page);
    }

    if (referrer) {
      conditions.push('referrer LIKE ?');
      params.push(`%${referrer}%`);
    }

    if (visitType) {
      conditions.push('visit_type = ?');
      params.push(visitType);
    }

    if (startDate) {
      conditions.push('timestamp_utc >= ?');
      params.push(startDate);
    }

    if (endDate) {
      conditions.push('timestamp_utc <= ?');
      params.push(endDate);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Total count query
    const countSql = `SELECT COUNT(*) as total FROM page_views ${whereClause}`;
    const totalRow = db.prepare(countSql).get(...params);
    const total = totalRow ? totalRow.total : 0;

    // Data query
    const dataSql = `
      SELECT 
        id, visitor_id, session_id, path, referrer, ip_address, ip_mode,
        country, country_name, region, city, is_approximate,
        device_type, browser, os, screen_category, visit_type,
        timestamp_utc, created_at_epoch
      FROM page_views
      ${whereClause}
      ORDER BY ${col} ${order}
      LIMIT ? OFFSET ?
    `;

    const rows = db.prepare(dataSql).all(...params, limit, offset);

    return {
      total,
      limit,
      offset,
      data: rows
    };
  },

  // Visitor history for drawer
  getVisitorHistory(visitorId) {
    return db.prepare(`
      SELECT 
        id, session_id, path, referrer, ip_address, ip_mode,
        country, country_name, city, device_type, browser, os,
        screen_category, visit_type, timestamp_utc, created_at_epoch
      FROM page_views
      WHERE visitor_id = ?
      ORDER BY created_at_epoch DESC
      LIMIT 100
    `).all(visitorId);
  },

  // Distinct filter options
  getFilterOptions() {
    const countries = db.prepare(`
      SELECT DISTINCT country, country_name 
      FROM page_views 
      WHERE country IS NOT NULL AND country != '' 
      ORDER BY country ASC
    `).all();

    const devices = db.prepare(`
      SELECT DISTINCT device_type 
      FROM page_views 
      WHERE device_type IS NOT NULL AND device_type != ''
    `).all().map(r => r.device_type);

    const pages = db.prepare(`
      SELECT DISTINCT path 
      FROM page_views 
      ORDER BY path ASC
    `).all().map(r => r.path);

    return { countries, devices, pages };
  },

  // Traffic sources breakdown
  getTrafficSources() {
    const rows = db.prepare(`
      SELECT 
        CASE 
          WHEN referrer IS NULL OR referrer = '' OR referrer = 'Direct' THEN 'Direct'
          WHEN referrer LIKE '%google%' THEN 'Google Search'
          WHEN referrer LIKE '%bing%' THEN 'Bing Search'
          WHEN referrer LIKE '%duckduckgo%' THEN 'DuckDuckGo'
          WHEN referrer LIKE '%github%' THEN 'GitHub'
          WHEN referrer LIKE '%linkedin%' THEN 'LinkedIn'
          WHEN referrer LIKE '%twitter%' OR referrer LIKE '%t.co%' OR referrer LIKE '%x.com%' THEN 'Twitter / X'
          WHEN referrer LIKE '%reddit%' THEN 'Reddit'
          ELSE referrer
        END as source_category,
        COUNT(*) as count
      FROM page_views
      GROUP BY source_category
      ORDER BY count DESC
      LIMIT 15
    `).all();

    return rows;
  },

  // Cleanup expired events based on retention policy
  cleanupExpiredEvents(retentionDays = null) {
    if (retentionDays === null) {
      const setting = db.prepare('SELECT value FROM analytics_settings WHERE key = ?').get('retention_days');
      retentionDays = setting ? parseInt(setting.value, 10) : 60;
    }

    if (isNaN(retentionDays) || retentionDays <= 0) {
      return { deletedCount: 0 };
    }

    const cutoffEpoch = Date.now() - (retentionDays * 24 * 60 * 60 * 1000);
    const stmt = db.prepare('DELETE FROM page_views WHERE created_at_epoch < ?');
    const result = stmt.run(cutoffEpoch);
    return { deletedCount: result.changes, cutoffDate: new Date(cutoffEpoch).toISOString() };
  },

  // Export authorized analytics data
  exportData() {
    return db.prepare(`
      SELECT 
        id, visitor_id, session_id, path, referrer, ip_address, ip_mode,
        country, country_name, region, city, is_approximate,
        device_type, browser, os, screen_category, visit_type,
        timestamp_utc
      FROM page_views
      ORDER BY created_at_epoch DESC
    `).all();
  },

  // Purge all analytics records
  purgeAllData() {
    const stmt = db.prepare('DELETE FROM page_views');
    const result = stmt.run();
    return { deletedCount: result.changes };
  }
};
