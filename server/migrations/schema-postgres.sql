-- ==============================================================================
-- Antigravity Portfolio Analytics - PostgreSQL / Supabase Migration Schema
-- Compatible with Supabase, Neon, AWS RDS, and Vercel Postgres
-- ==============================================================================

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

-- Analytics Global Settings
CREATE TABLE IF NOT EXISTS analytics_settings (
  key VARCHAR(100) PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ingested Page Views & Visitor Records
CREATE TABLE IF NOT EXISTS page_views (
  id BIGSERIAL PRIMARY KEY,
  visitor_id VARCHAR(128) NOT NULL,
  session_id VARCHAR(128) NOT NULL,
  path VARCHAR(500) NOT NULL,
  referrer VARCHAR(1000),
  ip_address VARCHAR(100),
  ip_mode VARCHAR(50) DEFAULT 'anonymized',
  country VARCHAR(10),
  country_name VARCHAR(100),
  region VARCHAR(100),
  city VARCHAR(100),
  is_approximate SMALLINT DEFAULT 1,
  device_type VARCHAR(50),
  browser VARCHAR(100),
  os VARCHAR(100),
  screen_category VARCHAR(50),
  visit_type VARCHAR(20) DEFAULT 'new',
  timestamp_utc TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at_epoch BIGINT NOT NULL
);

-- High Performance Indexes
CREATE INDEX IF NOT EXISTS idx_pg_page_views_epoch ON page_views(created_at_epoch DESC);
CREATE INDEX IF NOT EXISTS idx_pg_page_views_visitor ON page_views(visitor_id);
CREATE INDEX IF NOT EXISTS idx_pg_page_views_session ON page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_pg_page_views_path ON page_views(path);
CREATE INDEX IF NOT EXISTS idx_pg_page_views_country ON page_views(country);
CREATE INDEX IF NOT EXISTS idx_pg_page_views_device ON page_views(device_type);

-- Default Settings Seed
INSERT INTO analytics_settings (key, value, updated_at) VALUES 
  ('collect_raw_ip', 'false', NOW()),
  ('retention_days', '60', NOW()),
  ('anonymize_mode', 'truncate', NOW()),
  ('trust_proxy', 'false', NOW()),
  ('respect_dnt', 'true', NOW())
ON CONFLICT (key) DO NOTHING;

-- Supabase Row Level Security (RLS) Policies (Restricts public access)
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Deny public anon access to visitor records; only authenticated service role can read
CREATE POLICY "Deny anon access to page_views" ON page_views
  FOR SELECT TO anon USING (false);

CREATE POLICY "Allow service role full access to page_views" ON page_views
  FOR ALL TO service_role USING (true);
