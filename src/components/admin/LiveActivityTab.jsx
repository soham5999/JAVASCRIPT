import React, { useState, useEffect, useRef } from 'react';
import { Activity, Radio, RefreshCw, Clock, Globe, Laptop, ArrowRight, Shield } from 'lucide-react';
import VisitorDrawer from './VisitorDrawer';

export default function LiveActivityTab() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pollIntervalSec, setPollIntervalSec] = useState(5);
  const [secondsSinceRefresh, setSecondsSinceRefresh] = useState(0);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const timerRef = useRef(null);

  const fetchRealtime = () => {
    const token = localStorage.getItem('ag_admin_jwt');
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    fetch('/api/admin/realtime?window=5', {
      credentials: 'include',
      headers
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setData(json);
          setSecondsSinceRefresh(0);
        }
      })
      .catch((err) => console.error('Realtime fetch error:', err))
      .finally(() => setIsLoading(false));
  };

  // Polling effect
  useEffect(() => {
    fetchRealtime();

    if (pollIntervalSec > 0) {
      const interval = setInterval(fetchRealtime, pollIntervalSec * 1000);
      return () => clearInterval(interval);
    }
  }, [pollIntervalSec]);

  // Seconds counter tick
  useEffect(() => {
    const tick = setInterval(() => {
      setSecondsSinceRefresh((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(tick);
  }, []);

  const formatLocalTime = (utcStr) => {
    try {
      const d = new Date(utcStr);
      return d.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch {
      return utcStr;
    }
  };

  const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <div className="space-y-6">
      {/* Top Controller Bar */}
      <div className="glass-panel p-5 rounded-3xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <h2 className="text-xl font-display font-bold text-slate-100">Real-Time Traffic Radar</h2>
          </div>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            Real-time feed strictly reflecting events recorded within the last 5 minutes
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Refresh age indicator */}
          <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Updated: {secondsSinceRefresh}s ago</span>
          </div>

          {/* Poll Interval Select */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-mono text-slate-400">Poll:</span>
            <select
              value={pollIntervalSec}
              onChange={(e) => setPollIntervalSec(Number(e.target.value))}
              className="bg-black/40 border border-white/10 rounded-xl px-2.5 py-1 text-xs font-mono text-cyan-300 focus:outline-none"
            >
              <option value={5}>Every 5s</option>
              <option value={10}>Every 10s</option>
              <option value={30}>Every 30s</option>
              <option value={0}>Manual Only</option>
            </select>
          </div>

          {/* Manual Refresh Button */}
          <button
            onClick={fetchRealtime}
            disabled={isLoading}
            className="p-2 rounded-xl glass-panel glass-panel-hover text-slate-300 hover:text-cyan-400 border border-white/10"
            title="Refresh Now"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* KPI Cards: Active Visitors & Event Velocity */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30 hover:border-emerald-500/50 transition-all">
          <span className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
            Active Visitors Now (&lt; 5m)
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display font-bold text-emerald-400">
              {data?.activeVisitors || 0}
            </span>
            <span className="text-xs font-mono text-emerald-400/80">concurrent online</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono mt-2 block">
            *Excludes idle sessions older than 300 seconds
          </span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-cyan-500/30 hover:border-cyan-500/50 transition-all">
          <span className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
            Page Views in 5m Window
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display font-bold text-cyan-400">
              {data?.viewsInWindow || 0}
            </span>
            <span className="text-xs font-mono text-cyan-400/80">events</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono mt-2 block">
            Velocity: {((data?.viewsInWindow || 0) / 5).toFixed(1)} req/min
          </span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-indigo-500/30 hover:border-indigo-500/50 transition-all">
          <span className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
            Server Reference Time
          </span>
          <div className="text-sm font-mono font-semibold text-slate-200 mt-1">
            {data?.serverTimeUtc ? formatLocalTime(data.serverTimeUtc) : 'Syncing...'}
          </div>
          <span className="text-[10px] text-slate-500 font-mono mt-2 block">
            Local Timezone: {localTz}
          </span>
        </div>
      </div>

      {/* Live Event Stream Table */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-slate-100 text-sm flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400" />
            Live Visitor Stream (Recent 25 Ingested Events)
          </h3>
          <span className="text-[11px] font-mono text-slate-400">
            Click any row for complete event trail
          </span>
        </div>

        {!data?.recentEvents || data.recentEvents.length === 0 ? (
          <div className="py-12 text-center text-slate-500 font-mono text-xs">
            No live events detected yet. Browse the portfolio to see live telemetry stream.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 font-mono text-[11px] text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-3">Time</th>
                  <th className="py-3 px-3">Path Visited</th>
                  <th className="py-3 px-3">Location (Approx.)</th>
                  <th className="py-3 px-3">Device / Browser</th>
                  <th className="py-3 px-3">IP Mode</th>
                  <th className="py-3 px-3">Visit Type</th>
                  <th className="py-3 px-3 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {data.recentEvents.map((ev) => (
                  <tr
                    key={ev.id}
                    onClick={() => setSelectedVisitor(ev)}
                    className="hover:bg-white/5 cursor-pointer transition-colors group"
                  >
                    <td className="py-3 px-3 text-slate-300 whitespace-nowrap" title={`UTC: ${ev.timestamp_utc}`}>
                      {formatLocalTime(ev.timestamp_utc)}
                    </td>
                    <td className="py-3 px-3 font-semibold text-cyan-300">
                      {ev.path}
                    </td>
                    <td className="py-3 px-3 text-slate-300">
                      <span className="flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span className="truncate max-w-[130px]">
                          {ev.city ? `${ev.city}, ` : ''}{ev.country_name || ev.country || 'Unknown'}
                        </span>
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400">
                      <span className="truncate max-w-[140px] block">
                        {ev.browser} on {ev.os}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                        ev.ip_mode === 'raw' 
                          ? 'bg-amber-500/20 text-amber-300' 
                          : 'bg-cyan-500/20 text-cyan-300'
                      }`}>
                        {ev.ip_mode || 'anonymized'}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                        ev.visit_type === 'returning'
                          ? 'bg-violet-500/20 text-violet-300'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}>
                        {ev.visit_type}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="text-slate-500 group-hover:text-cyan-400 transition-colors inline-flex items-center gap-1 text-[11px]">
                        <span>Inspect</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
