-- ==============================================================================
-- Antigravity Portfolio Analytics - SQLite Database Schema
-- ==============================================================================

PRAGMA journal_mode = WAL;
PRAGMA synchronous = NORMAL;

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TEXT NOT NULL,
  last_login TEXT
);

-- Analytics Global Settings
CREATE TABLE IF NOT EXISTS analytics_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Ingested Page Views & Visitor Records
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

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_page_views_created_epoch ON page_views(created_at_epoch);
CREATE INDEX IF NOT EXISTS idx_page_views_visitor_id ON page_views(visitor_id);
CREATE INDEX IF NOT EXISTS idx_page_views_session_id ON page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_page_views_path ON page_views(path);
CREATE INDEX IF NOT EXISTS idx_page_views_country ON page_views(country);
CREATE INDEX IF NOT EXISTS idx_page_views_device ON page_views(device_type);

-- Default Settings
INSERT OR IGNORE INTO analytics_settings (key, value, updated_at) VALUES ('collect_raw_ip', 'false', datetime('now'));
INSERT OR IGNORE INTO analytics_settings (key, value, updated_at) VALUES ('retention_days', '60', datetime('now'));
INSERT OR IGNORE INTO analytics_settings (key, value, updated_at) VALUES ('anonymize_mode', 'truncate', datetime('now'));
INSERT OR IGNORE INTO analytics_settings (key, value, updated_at) VALUES ('trust_proxy', 'false', datetime('now'));
INSERT OR IGNORE INTO analytics_settings (key, value, updated_at) VALUES ('respect_dnt', 'true', datetime('now'));
