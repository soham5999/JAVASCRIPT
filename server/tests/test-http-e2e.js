import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { dbRepo } from '../db.js';
import authRoutes from '../routes/auth.js';
import analyticsRoutes from '../routes/analytics.js';
import adminRoutes from '../routes/admin.js';

let passed = 0;
let total = 0;

function check(condition, message) {
  total++;
  if (!condition) {
    console.error(`❌ HTTP TEST FAILED: ${message}`);
    throw new Error(`HTTP test failed: ${message}`);
  }
  passed++;
  console.log(`✅ HTTP TEST PASSED: ${message}`);
}

async function runHttpE2ETests() {
  console.log('\n🌐 Running Antigravity End-to-End HTTP Server Test...\n');

  const app = express();
  app.use(cors({ origin: true, credentials: true }));
  app.use(cookieParser());
  app.use(express.json());

  app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
  app.use('/api/auth', authRoutes);
  app.use('/api/analytics', analyticsRoutes);
  app.use('/api/admin', adminRoutes);

  const server = await new Promise((resolve) => {
    const s = app.listen(5099, () => resolve(s));
  });

  const baseUrl = 'http://127.0.0.1:5099';

  try {
    // 1. Health check
    const healthRes = await fetch(`${baseUrl}/api/health`);
    const healthData = await healthRes.json();
    check(healthRes.status === 200 && healthData.status === 'ok', 'GET /api/health returned 200 OK');

    // 2. Ingestion endpoint with sanitized payload
    const ingestPayload = {
      visitorId: 'test_http_visitor_001',
      sessionId: 'test_http_session_001',
      path: '/#projects?token=secret123&utm_source=fb',
      referrer: 'https://linkedin.com/feed/?query=sensitive_param',
      screen: 'desktop',
      consent: true
    };

    const ingestRes = await fetch(`${baseUrl}/api/analytics/collect`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0'
      },
      body: JSON.stringify(ingestPayload)
    });
    const ingestData = await ingestRes.json();
    check(ingestRes.status === 200 && ingestData.success === true, 'POST /api/analytics/collect accepted event');

    // Verify sanitized path in database
    const lastLog = dbRepo.getVisitorLogs({ search: 'test_http_visitor_001', limit: 1 });
    check(lastLog.data.length > 0, 'Event saved to database');
    check(!lastLog.data[0].path.includes('secret123'), 'Sanitized path stripped query parameters');
    check(!lastLog.data[0].referrer.includes('sensitive_param'), 'Sanitized referrer stripped sensitive params');
    check(lastLog.data[0].ip_mode === 'truncated' || lastLog.data[0].ip_mode === 'pseudonymized', 'Raw IP was NOT saved (privacy default enforced)');

    // 3. Security: Unauthenticated access to /api/admin/overview MUST be blocked (401)
    const unauthRes = await fetch(`${baseUrl}/api/admin/overview`);
    check(unauthRes.status === 401, 'Unauthenticated GET /api/admin/overview returned 401 Unauthorized');

    // 4. Security: Admin login with wrong password rejected (401)
    const badLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'incorrect_password' })
    });
    check(badLoginRes.status === 401, 'POST /api/auth/login with wrong credentials returned 401');

    // 5. Admin login with correct password returns valid JWT
    const goodLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'antigravity2026!' })
    });
    check(goodLoginRes.status === 200, 'POST /api/auth/login with correct credentials returned 200');
    const goodLoginData = await goodLoginRes.json();
    check(Boolean(goodLoginData.token), 'JWT token returned on successful authentication');

    const adminToken = goodLoginData.token;
    const authHeaders = {
      'Authorization': `Bearer ${adminToken}`,
      'Content-Type': 'application/json'
    };

    // 6. Security: Verify /api/auth/me returns admin identity
    const meRes = await fetch(`${baseUrl}/api/auth/me`, { headers: authHeaders });
    const meData = await meRes.json();
    check(meRes.status === 200 && meData.user.username === 'admin', 'GET /api/auth/me verified admin session');

    // 7. Protected: GET /api/admin/overview with JWT
    const overviewRes = await fetch(`${baseUrl}/api/admin/overview`, { headers: authHeaders });
    const overviewData = await overviewRes.json();
    check(overviewRes.status === 200 && overviewData.metrics.totalViews >= 1, 'GET /api/admin/overview returned accurate verified metrics');

    // 8. Protected: GET /api/admin/visitors with JWT & pagination
    const visitorsRes = await fetch(`${baseUrl}/api/admin/visitors?limit=5`, { headers: authHeaders });
    const visitorsData = await visitorsRes.json();
    check(visitorsRes.status === 200 && visitorsData.data.length >= 1, 'GET /api/admin/visitors returned paginated records');

    // 9. Protected: GET /api/admin/realtime with JWT
    const realtimeRes = await fetch(`${baseUrl}/api/admin/realtime?window=5`, { headers: authHeaders });
    const realtimeData = await realtimeRes.json();
    check(realtimeRes.status === 200 && realtimeData.activeVisitors >= 1, 'GET /api/admin/realtime returns active visitors in <5m window');

    // 10. Protected: Data export in JSON & CSV
    const exportJsonRes = await fetch(`${baseUrl}/api/admin/export?format=json`, { headers: authHeaders });
    const exportJsonData = await exportJsonRes.json();
    check(exportJsonRes.status === 200 && Array.isArray(exportJsonData.records), 'GET /api/admin/export?format=json returns valid JSON payload');

    const exportCsvRes = await fetch(`${baseUrl}/api/admin/export?format=csv`, { headers: authHeaders });
    const exportCsvText = await exportCsvRes.text();
    check(exportCsvRes.status === 200 && exportCsvText.includes('visitor_id'), 'GET /api/admin/export?format=csv returns valid CSV format');

    console.log(`\n🎉 ALL ${passed}/${total} END-TO-END HTTP TESTS PASSED SUCCESSFULLY!\n`);
  } finally {
    server.close();
  }
}

runHttpE2ETests().catch((err) => {
  console.error('HTTP E2E test suite error:', err);
  process.exit(1);
});
