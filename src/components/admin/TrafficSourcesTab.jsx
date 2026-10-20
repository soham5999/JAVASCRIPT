import React, { useState, useEffect } from 'react';
import { Share2, Compass, Globe, ExternalLink, RefreshCw } from 'lucide-react';

export default function TrafficSourcesTab() {
  const [sources, setSources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSources = () => {
    setIsLoading(true);
    const token = localStorage.getItem('ag_admin_jwt');
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    fetch('/api/admin/traffic-sources', { credentials: 'include', headers })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setSources(json.sources || []);
      })
      .catch((err) => console.error('Traffic sources fetch error:', err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchSources();
  }, []);

  const total = sources.reduce((sum, s) => sum + (s.count || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-display font-bold text-slate-100">Traffic Acquisition & Sources</h2>
          <p className="text-xs font-mono text-slate-400">
            Referral origins, search engines, and organic inbound channels
          </p>
        </div>

        <button
          onClick={fetchSources}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-panel text-xs font-mono text-slate-300 hover:text-cyan-400 border border-white/10"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Source List Card */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <h3 className="font-display font-bold text-slate-100 text-sm">
            Top Referring Domains & Channels
          </h3>

          {sources.length === 0 ? (
            <div className="py-12 text-center text-slate-500 font-mono text-xs">
              No referral sources recorded yet.
            </div>
          ) : (
            <div className="space-y-3">
              {sources.map((src) => {
                const pct = total > 0 ? Math.round((src.count / total) * 100) : 0;
                return (
                  <div key={src.source_category} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="text-slate-200 font-semibold">{src.source_category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-cyan-400">{src.count} visits</span>
                        <span className="text-slate-500">({pct}%)</span>
                      </div>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500"
                        style={{ width: `${Math.max(3, pct)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Informational Guidance Card */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 inline-block">
              <Compass className="w-6 h-6" />
            </div>
            <h4 className="font-display font-bold text-slate-100 text-sm">
              Referrer Privacy Ingestion Rules
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              To guarantee zero PII leakage, external referrers have all URL query parameters, tracking tags, and authorization tokens completely removed at ingestion time.
            </p>
            <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-[11px] font-mono text-slate-400 space-y-1">
              <div>• Direct: Typed URL or bookmark</div>
              <div>• Search: Google, Bing, DuckDuckGo</div>
              <div>• Social: LinkedIn, GitHub, Twitter/X</div>
            </div>
          </div>

          <div className="text-[11px] font-mono text-slate-500 pt-3 border-t border-white/5">
            Total Analyzed Sessions: {total}
          </div>
        </div>
      </div>
    </div>
  );
}
