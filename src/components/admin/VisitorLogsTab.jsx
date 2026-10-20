import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight, 
  Globe, Laptop, Clock, Shield, RefreshCw, X, ArrowRight, Download 
} from 'lucide-react';
import VisitorDrawer from './VisitorDrawer';

export default function VisitorLogsTab() {
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [filterOptions, setFilterOptions] = useState({ countries: [], devices: [], pages: [] });
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('created_at_epoch');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [country, setCountry] = useState('');
  const [device, setDevice] = useState('');
  const [pagePath, setPagePath] = useState('');
  const [visitType, setVisitType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [selectedVisitor, setSelectedVisitor] = useState(null);

  // Load filter options once
  useEffect(() => {
    const token = localStorage.getItem('ag_admin_jwt');
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    fetch('/api/admin/filter-options', { credentials: 'include', headers })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setFilterOptions({
            countries: data.countries || [],
            devices: data.devices || [],
            pages: data.pages || []
          });
        }
      })
      .catch((err) => console.error('Filter options error:', err));
  }, []);

  // Fetch visitor logs
  const fetchLogs = (pageNumber = pagination.page) => {
    setIsLoading(true);
    const token = localStorage.getItem('ag_admin_jwt');
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const params = new URLSearchParams({
      page: String(pageNumber),
      limit: String(pagination.limit),
      sortBy,
      sortOrder
    });

    if (search.trim()) params.append('search', search.trim());
    if (country) params.append('country', country);
    if (device) params.append('device', device);
    if (pagePath) params.append('pagePath', pagePath);
    if (visitType) params.append('visitType', visitType);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    fetch(`/api/admin/visitors?${params.toString()}`, { credentials: 'include', headers })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setLogs(json.data || []);
          if (json.pagination) {
            setPagination(json.pagination);
          }
        }
      })
      .catch((err) => console.error('Fetch logs error:', err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchLogs(1);
  }, [sortBy, sortOrder, country, device, pagePath, visitType, startDate, endDate]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchLogs(1);
  };

  const handleSortToggle = (col) => {
    if (sortBy === col) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(col);
      setSortOrder('DESC');
    }
  };

  const resetFilters = () => {
    setSearch('');
    setCountry('');
    setDevice('');
    setPagePath('');
    setVisitType('');
    setStartDate('');
    setEndDate('');
    setSortBy('created_at_epoch');
    setSortOrder('DESC');
  };

  const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const formatLocalTime = (utcStr) => {
    try {
      const d = new Date(utcStr);
      return d.toLocaleString(undefined, {
        dateStyle: 'short',
        timeStyle: 'medium'
      });
    } catch {
      return utcStr;
    }
  };

  return (
    <div className="space-y-5">
      {/* Search & Action Bar */}
      <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search IP, path, country, city, browser, visitor ID..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
            />
          </form>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchLogs(pagination.page)}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl glass-panel text-xs font-mono text-slate-300 hover:text-cyan-400 border border-white/10"
              title="Refresh"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              onClick={resetFilters}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-slate-400 hover:text-slate-200 border border-white/5"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Multi-Field Filter Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2 border-t border-white/5 text-xs font-mono">
          {/* Country Filter */}
          <div>
            <label className="text-[10px] uppercase text-slate-400 block mb-1">Country</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-slate-200 focus:outline-none"
            >
              <option value="">All Countries</option>
              {filterOptions.countries.map((c) => (
                <option key={c.country} value={c.country}>
                  {c.country_name || c.country} ({c.country})
                </option>
              ))}
            </select>
          </div>

          {/* Device Filter */}
          <div>
            <label className="text-[10px] uppercase text-slate-400 block mb-1">Device</label>
            <select
              value={device}
              onChange={(e) => setDevice(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-slate-200 focus:outline-none"
            >
              <option value="">All Devices</option>
              {filterOptions.devices.map((d) => (
                <option key={d} value={d} className="capitalize">
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Page Filter */}
          <div>
            <label className="text-[10px] uppercase text-slate-400 block mb-1">Page Path</label>
            <select
              value={pagePath}
              onChange={(e) => setPagePath(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-slate-200 focus:outline-none"
            >
              <option value="">All Pages</option>
              {filterOptions.pages.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Visit Type */}
          <div>
            <label className="text-[10px] uppercase text-slate-400 block mb-1">Visit Type</label>
            <select
              value={visitType}
              onChange={(e) => setVisitType(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-slate-200 focus:outline-none"
            >
              <option value="">All Types</option>
              <option value="new">New Visitors</option>
              <option value="returning">Returning</option>
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="text-[10px] uppercase text-slate-400 block mb-1">From Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-xs text-slate-200 focus:outline-none"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="text-[10px] uppercase text-slate-400 block mb-1">To Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-xs text-slate-200 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 font-mono text-[11px] text-slate-400 uppercase tracking-wider bg-white/[0.02]">
                <th
                  onClick={() => handleSortToggle('ip_address')}
                  className="py-3.5 px-4 cursor-pointer hover:text-cyan-400 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>IP Address</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th
                  onClick={() => handleSortToggle('created_at_epoch')}
                  className="py-3.5 px-4 cursor-pointer hover:text-cyan-400 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Visit Time ({localTz})</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th
                  onClick={() => handleSortToggle('path')}
                  className="py-3.5 px-4 cursor-pointer hover:text-cyan-400 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Page</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th
                  onClick={() => handleSortToggle('country')}
                  className="py-3.5 px-4 cursor-pointer hover:text-cyan-400 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Approx. Location</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th className="py-3.5 px-4">Device</th>
                <th className="py-3.5 px-4">Browser / OS</th>
                <th className="py-3.5 px-4">Referrer</th>
                <th className="py-3.5 px-4">Visit Type</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5 font-mono">
              {isLoading && logs.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-slate-500">
                    <span className="inline-block w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mr-2" />
                    Loading records from database...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-slate-500">
                    No visitor records found matching current query and filters.
                  </td>
                </tr>
              ) : (
                logs.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => setSelectedVisitor(row)}
                    className="hover:bg-white/5 cursor-pointer transition-colors group"
                  >
                    {/* IP */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-200">
                          {row.ip_address || 'Not Recorded'}
                        </span>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded ${
                            row.ip_mode === 'raw'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-cyan-500/20 text-cyan-300'
                          }`}
                        >
                          {row.ip_mode}
                        </span>
                      </div>
                    </td>

                    {/* Time */}
                    <td className="py-3 px-4 text-slate-300 whitespace-nowrap" title={`UTC: ${row.timestamp_utc}`}>
                      {formatLocalTime(row.timestamp_utc)}
                    </td>

                    {/* Page */}
                    <td className="py-3 px-4 font-semibold text-cyan-300">
                      {row.path}
                    </td>

                    {/* Location */}
                    <td className="py-3 px-4 text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span className="truncate max-w-[140px]" title={row.country_name || row.country}>
                          {row.city ? `${row.city}, ` : ''}{row.country_name || row.country || 'Unknown'}
                        </span>
                      </div>
                    </td>

                    {/* Device */}
                    <td className="py-3 px-4 text-slate-400 capitalize">
                      {row.device_type}
                    </td>

                    {/* Browser & OS */}
                    <td className="py-3 px-4 text-slate-400">
                      <span className="truncate max-w-[140px] block" title={`${row.browser} on ${row.os}`}>
                        {row.browser} / {row.os}
                      </span>
                    </td>

                    {/* Referrer */}
                    <td className="py-3 px-4 text-slate-400 truncate max-w-[120px]" title={row.referrer}>
                      {row.referrer || 'Direct'}
                    </td>

                    {/* Type */}
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] ${
                          row.visit_type === 'returning'
                            ? 'bg-violet-500/20 text-violet-300'
                            : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        {row.visit_type}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-right">
                      <span className="text-slate-500 group-hover:text-cyan-400 transition-colors inline-flex items-center gap-1 text-[11px]">
                        <span>Trail</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-400">
          <div>
            Showing {logs.length > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} records
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchLogs(pagination.page - 1)}
              disabled={pagination.page <= 1 || isLoading}
              className="p-1.5 rounded-lg border border-white/10 text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3 py-1 bg-white/5 rounded-lg text-slate-200">
              Page {pagination.page} of {Math.max(1, pagination.totalPages)}
            </span>

            <button
              onClick={() => fetchLogs(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages || isLoading}
              className="p-1.5 rounded-lg border border-white/10 text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Slide-over Visitor Details Drawer */}
      {selectedVisitor && (
        <VisitorDrawer
          visitor={selectedVisitor}
          onClose={() => setSelectedVisitor(null)}
        />
      )}
    </div>
  );
}
