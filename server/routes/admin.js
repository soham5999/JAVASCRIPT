import { Router } from 'express';
import { dbRepo } from '../db.js';
import { requireAdminAuth } from '../middleware/auth.js';

const router = Router();

// Enforce admin authentication on all routes in this module
router.use(requireAdminAuth);

/**
 * GET /api/admin/overview
 * High-level KPIs, 14-day daily trends, popular pages, device breakdown
 */
router.get('/overview', (req, res) => {
  try {
    const metrics = dbRepo.getOverviewMetrics();
    const dailyTrends = dbRepo.getDailyTrends(14);
    const popularPages = dbRepo.getPopularPages(8);
    const deviceBreakdown = dbRepo.getDeviceBreakdown();

    return res.json({
      success: true,
      metrics,
      dailyTrends,
      popularPages,
      deviceBreakdown,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Error fetching admin overview:', err);
    return res.status(500).json({ error: 'Failed to fetch overview metrics.' });
  }
});

/**
 * GET /api/admin/realtime
 * Active visitors (events in last 5 minutes), recent event stream
 */
router.get('/realtime', (req, res) => {
  try {
    const windowMinutes = Math.min(60, Math.max(1, parseInt(req.query.window || '5', 10)));
    const realtimeData = dbRepo.getRealtimeActivity(windowMinutes);

    return res.json({
      success: true,
      ...realtimeData
    });
  } catch (err) {
    console.error('Error fetching realtime stats:', err);
    return res.status(500).json({ error: 'Failed to fetch realtime data.' });
  }
});

/**
 * GET /api/admin/visitors
 * Searchable, sortable, paginated visitor logs with multi-field filtering
 */
router.get('/visitors', (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = '',
      sortBy = 'created_at_epoch',
      sortOrder = 'DESC',
      country = '',
      device = '',
      pagePath = '',
      referrer = '',
      visitType = '',
      startDate = '',
      endDate = ''
    } = req.query;

    const parsedPage = Math.max(1, parseInt(page, 10));
    const parsedLimit = Math.min(100, Math.max(5, parseInt(limit, 10)));
    const offset = (parsedPage - 1) * parsedLimit;

    const result = dbRepo.getVisitorLogs({
      limit: parsedLimit,
      offset,
      search: String(search || ''),
      sortBy: String(sortBy || 'created_at_epoch'),
      sortOrder: String(sortOrder || 'DESC'),
      country: String(country || ''),
      device: String(device || ''),
      page: String(pagePath || ''),
      referrer: String(referrer || ''),
      visitType: String(visitType || ''),
      startDate: String(startDate || ''),
      endDate: String(endDate || '')
    });

    const totalPages = Math.ceil(result.total / parsedLimit);

    return res.json({
      success: true,
      data: result.data,
      pagination: {
        page: parsedPage,
        limit: parsedLimit,
        total: result.total,
        totalPages
      }
    });
  } catch (err) {
    console.error('Error fetching visitor logs:', err);
    return res.status(500).json({ error: 'Failed to fetch visitor logs.' });
  }
});

/**
 * GET /api/admin/visitors/:id/history
 * Detailed event history for the visitor details drawer
 */
router.get('/visitors/:id/history', (req, res) => {
  try {
    const visitorId = req.params.id;
    if (!visitorId) {
      return res.status(400).json({ error: 'Visitor ID is required.' });
    }

    const events = dbRepo.getVisitorHistory(visitorId);
    return res.json({
      success: true,
      visitorId,
      events
    });
  } catch (err) {
    console.error('Error fetching visitor history:', err);
    return res.status(500).json({ error: 'Failed to fetch visitor history.' });
  }
});

/**
 * GET /api/admin/filter-options
 * Dropdown options for countries, devices, and visited pages
 */
router.get('/filter-options', (req, res) => {
  try {
    const options = dbRepo.getFilterOptions();
    return res.json({ success: true, ...options });
  } catch (err) {
    console.error('Error fetching filter options:', err);
    return res.status(500).json({ error: 'Failed to fetch filter options.' });
  }
});

/**
 * GET /api/admin/traffic-sources
 * Referrer classification breakdown
 */
router.get('/traffic-sources', (req, res) => {
  try {
    const sources = dbRepo.getTrafficSources();
    return res.json({ success: true, sources });
  } catch (err) {
    console.error('Error fetching traffic sources:', err);
    return res.status(500).json({ error: 'Failed to fetch traffic sources.' });
  }
});

/**
 * GET /api/admin/pages-devices
 * Full breakdown of visited pages and device specs
 */
router.get('/pages-devices', (req, res) => {
  try {
    const popularPages = dbRepo.getPopularPages(20);
    const deviceBreakdown = dbRepo.getDeviceBreakdown();
    return res.json({ success: true, popularPages, deviceBreakdown });
  } catch (err) {
    console.error('Error fetching pages and devices:', err);
    return res.status(500).json({ error: 'Failed to fetch page & device statistics.' });
  }
});

/**
 * GET /api/admin/settings
 * Retrieves current analytics and retention settings
 */
router.get('/settings', (req, res) => {
  try {
    const settings = dbRepo.getAllSettings();
    return res.json({
      success: true,
      settings: {
        collect_raw_ip: settings.collect_raw_ip === 'true',
        retention_days: parseInt(settings.retention_days || '60', 10),
        anonymize_mode: settings.anonymize_mode || 'truncate',
        trust_proxy: settings.trust_proxy === 'true',
        respect_dnt: settings.respect_dnt === 'true'
      }
    });
  } catch (err) {
    console.error('Error reading settings:', err);
    return res.status(500).json({ error: 'Failed to load settings.' });
  }
});

/**
 * PUT /api/admin/settings
 * Updates analytics configuration (retention, raw IP, trust proxy)
 */
router.put('/settings', (req, res) => {
  try {
    const { collect_raw_ip, retention_days, anonymize_mode, trust_proxy, respect_dnt } = req.body || {};

    if (collect_raw_ip !== undefined) {
      dbRepo.setSetting('collect_raw_ip', collect_raw_ip ? 'true' : 'false');
    }

    if (retention_days !== undefined) {
      const days = parseInt(retention_days, 10);
      if (isNaN(days) || days < 1 || days > 730) {
        return res.status(400).json({ error: 'Retention days must be an integer between 1 and 730.' });
      }
      dbRepo.setSetting('retention_days', String(days));
    }

    if (anonymize_mode !== undefined) {
      if (!['truncate', 'hash'].includes(anonymize_mode)) {
        return res.status(400).json({ error: 'Invalid anonymize mode. Choose "truncate" or "hash".' });
      }
      dbRepo.setSetting('anonymize_mode', anonymize_mode);
    }

    if (trust_proxy !== undefined) {
      dbRepo.setSetting('trust_proxy', trust_proxy ? 'true' : 'false');
    }

    if (respect_dnt !== undefined) {
      dbRepo.setSetting('respect_dnt', respect_dnt ? 'true' : 'false');
    }

    return res.json({ success: true, message: 'Settings updated successfully.' });
  } catch (err) {
    console.error('Error saving settings:', err);
    return res.status(500).json({ error: 'Failed to save settings.' });
  }
});

/**
 * POST /api/admin/cleanup
 * Manually trigger retention policy cleanup
 */
router.post('/cleanup', (req, res) => {
  try {
    const result = dbRepo.cleanupExpiredEvents();
    return res.json({
      success: true,
      message: `Cleaned up ${result.deletedCount} expired events.`,
      result
    });
  } catch (err) {
    console.error('Cleanup error:', err);
    return res.status(500).json({ error: 'Retention cleanup failed.' });
  }
});

/**
 * GET /api/admin/export
 * Exports authorized analytics records in JSON or CSV
 */
router.get('/export', (req, res) => {
  try {
    const format = (req.query.format || 'json').toLowerCase();
    const data = dbRepo.exportData();

    if (format === 'csv') {
      if (data.length === 0) {
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="analytics-export.csv"');
        return res.send('No data');
      }

      const headers = Object.keys(data[0]);
      const csvRows = [headers.join(',')];

      for (const row of data) {
        const values = headers.map(header => {
          const val = row[header] ?? '';
          const escaped = String(val).replace(/"/g, '""');
          return `"${escaped}"`;
        });
        csvRows.push(values.join(','));
      }

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="analytics-export-${Date.now()}.csv"`);
      return res.send(csvRows.join('\n'));
    }

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="analytics-export-${Date.now()}.json"`);
    return res.json({
      exportedAt: new Date().toISOString(),
      recordCount: data.length,
      records: data
    });
  } catch (err) {
    console.error('Export error:', err);
    return res.status(500).json({ error: 'Data export failed.' });
  }
});

/**
 * DELETE /api/admin/data
 * Purges analytics data permanently upon explicit confirmation
 */
router.delete('/data', (req, res) => {
  try {
    const { confirmation } = req.body || {};
    if (confirmation !== 'DELETE_ALL_ANALYTICS_DATA') {
      return res.status(400).json({
        error: 'Confirmation phrase required. Send { confirmation: "DELETE_ALL_ANALYTICS_DATA" }'
      });
    }

    const result = dbRepo.purgeAllData();
    return res.json({
      success: true,
      message: `Permanently deleted ${result.deletedCount} analytics records.`
    });
  } catch (err) {
    console.error('Purge error:', err);
    return res.status(500).json({ error: 'Failed to purge analytics data.' });
  }
});

export default router;
