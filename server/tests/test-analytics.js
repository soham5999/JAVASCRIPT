import http from 'node:http';
import bcrypt from 'bcryptjs';
import { dbRepo } from '../db.js';
import { generateToken } from '../middleware/auth.js';
import { lookupGeoLocation } from '../services/geoService.js';
import { processIpForStorage, truncateIp, pseudonymizeIp, isPrivateIp } from '../services/privacyService.js';
import { parseDeviceAndBrowser } from '../services/deviceService.js';

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  passedTests++;
  console.log(`✅ PASSED: ${message}`);
}

async function runTests() {
  console.log('\n🧪 Starting Antigravity Analytics Test Suite...\n');

  // Test 1: GeoIP Service
  console.log('--- Testing Geolocation & Privacy Service ---');
  const localGeo = lookupGeoLocation('127.0.0.1');
  assert(localGeo.country === 'LOCAL', 'Localhost IP identified as LOCAL');
  assert(localGeo.is_approximate === true, 'Localhost IP is explicitly marked approximate');

  const privateGeo = lookupGeoLocation('192.168.1.1');
  assert(privateGeo.country === 'LOCAL', 'Private subnet 192.168.x identified as LOCAL');

  const publicGeo = lookupGeoLocation('8.8.8.8');
  assert(publicGeo.country === 'US', 'Public Google DNS IP identified as US');
  assert(publicGeo.is_approximate === true, 'Public IP marked approximate');

  // Test 2: Privacy Service IP Anonymization
  console.log('\n--- Testing IP Privacy Controls ---');
  const truncated = truncateIp('203.0.113.195');
  assert(truncated === '203.0.113.xxx', 'IPv4 properly truncated removing last octet');

  const pseudo = pseudonymizeIp('203.0.113.195');
  assert(pseudo.startsWith('pseudo_'), 'Pseudonymized IP starts with pseudo_ prefix');
  assert(!pseudo.includes('203.0.113'), 'Pseudonymized IP does not contain raw octets');

  // Verify default settings have raw IP disabled
  dbRepo.setSetting('collect_raw_ip', 'false');
  const processed = processIpForStorage('203.0.113.50');
  assert(processed.ip_mode === 'truncated', 'Default mode is truncated');
  assert(processed.ip_address === '203.0.113.xxx', 'Default storage truncates IP');

  // Test 3: Device & User-Agent Parsing
  console.log('\n--- Testing Device & User-Agent Parsing ---');
  const desktopParsed = parseDeviceAndBrowser(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'desktop'
  );
  assert(desktopParsed.deviceType === 'desktop', 'Desktop UA identified correctly');
  assert(desktopParsed.browser === 'Chrome', 'Chrome browser identified correctly');
  assert(desktopParsed.os.includes('Windows'), 'Windows OS identified correctly');

  const mobileParsed = parseDeviceAndBrowser(
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
    'mobile'
  );
  assert(mobileParsed.deviceType === 'mobile', 'iPhone UA identified as mobile');
  assert(mobileParsed.browser === 'Mobile Safari' || mobileParsed.browser.includes('Safari'), 'Safari browser identified');

  // Test 4: Database Operations & Metrics
  console.log('\n--- Testing Database Ingestion & Metrics ---');
  const testVisitorId = `test_visitor_${Date.now()}`;
  const testSessionId = `test_session_${Date.now()}`;
  const now = new Date();

  // Insert 1st event (new visit)
  dbRepo.recordPageView({
    visitor_id: testVisitorId,
    session_id: testSessionId,
    path: '/#projects',
    referrer: 'https://github.com/soham5999',
    ip_address: '198.51.100.xxx',
    ip_mode: 'truncated',
    country: 'US',
    country_name: 'United States',
    region: 'CA',
    city: 'San Francisco',
    is_approximate: 1,
    device_type: 'desktop',
    browser: 'Chrome',
    os: 'Windows 11',
    screen_category: 'desktop',
    visit_type: 'new',
    timestamp_utc: now.toISOString(),
    created_at_epoch: now.getTime()
  });

  // Verify hasVisitorVisitedBefore is now true
  const hasVisited = dbRepo.hasVisitorVisitedBefore(testVisitorId);
  assert(hasVisited === true, 'Visitor history detected returning status');

  // Insert 2nd event (returning visit)
  dbRepo.recordPageView({
    visitor_id: testVisitorId,
    session_id: testSessionId,
    path: '/#skills',
    referrer: 'Direct',
    ip_address: '198.51.100.xxx',
    ip_mode: 'truncated',
    country: 'US',
    country_name: 'United States',
    region: 'CA',
    city: 'San Francisco',
    is_approximate: 1,
    device_type: 'desktop',
    browser: 'Chrome',
    os: 'Windows 11',
    screen_category: 'desktop',
    visit_type: 'returning',
    timestamp_utc: new Date(now.getTime() + 1000).toISOString(),
    created_at_epoch: now.getTime() + 1000
  });

  // Verify Overview Metrics
  const overview = dbRepo.getOverviewMetrics();
  assert(overview.totalViews >= 2, 'Total views recorded');
  assert(overview.uniqueVisitors >= 1, 'Unique visitors recorded');
  assert(overview.visitorsToday >= 1, 'Visitors today recorded');

  // Verify Visitor Logs Search and Filter
  const logs = dbRepo.getVisitorLogs({
    search: testVisitorId,
    limit: 10
  });
  assert(logs.total >= 2, 'Search by visitor_id retrieved records');
  assert(logs.data[0].path === '/#skills', 'Sort order is DESC by default (most recent first)');

  // Verify Visitor Drawer History
  const history = dbRepo.getVisitorHistory(testVisitorId);
  assert(history.length >= 2, 'Visitor history drawer returns all session events');

  // Verify Realtime Activity (< 5 minutes cutoff)
  const realtime = dbRepo.getRealtimeActivity(5);
  assert(realtime.activeVisitors >= 1, 'Active visitors within 5 minutes counted');
  assert(realtime.viewsInWindow >= 2, 'Views within window counted');
  assert(realtime.recentEvents.length > 0, 'Recent events stream present');

  // Test 5: Authentication & Token Verification
  console.log('\n--- Testing Authentication & Authorization ---');
  const dummyAdmin = { id: 9999, username: 'test_admin_user', role: 'admin' };
  const token = generateToken(dummyAdmin);
  assert(typeof token === 'string' && token.length > 20, 'Signed JWT generated');

  // Test 6: Retention Cleanup
  console.log('\n--- Testing Retention Cleanup ---');
  // Insert an ancient record (100 days old)
  const hundredDaysAgo = Date.now() - (100 * 24 * 60 * 60 * 1000);
  dbRepo.recordPageView({
    visitor_id: 'ancient_visitor',
    session_id: 'ancient_session',
    path: '/#old',
    referrer: 'Direct',
    ip_address: '10.0.0.xxx',
    ip_mode: 'truncated',
    country: 'LOCAL',
    country_name: 'Local',
    region: '',
    city: '',
    is_approximate: 1,
    device_type: 'desktop',
    browser: 'Chrome',
    os: 'Linux',
    screen_category: 'desktop',
    visit_type: 'new',
    timestamp_utc: new Date(hundredDaysAgo).toISOString(),
    created_at_epoch: hundredDaysAgo
  });

  const cleanupRes = dbRepo.cleanupExpiredEvents(60); // 60 day retention
  assert(cleanupRes.deletedCount >= 1, 'Retention cleanup deleted records older than 60 days');

  // Test 7: Export data
  console.log('\n--- Testing Data Export ---');
  const exported = dbRepo.exportData();
  assert(Array.isArray(exported) && exported.length > 0, 'Export returns array of analytics records');

  console.log(`\n🎉 ALL ${passedTests}/${totalTests} TESTS PASSED SUCCESSFULLY!\n`);
}

runTests().catch(err => {
  console.error('\n❌ Test suite failure:', err);
  process.exit(1);
});
