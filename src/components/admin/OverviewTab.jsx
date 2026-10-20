import React, { useState, useEffect } from 'react';
import { Eye, Users, Calendar, Activity, Compass, Share2, RefreshCw, AlertCircle } from 'lucide-react';
import MetricCard from './MetricCard';
import { DailyTrendChart, PopularPagesBarChart, DeviceDonutChart, BrowserOSChart } from './Charts';

export default function OverviewTab() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOverview = () => {
    setIsLoading(true);
    setError(null);

    const token = localStorage.getItem('ag_admin_jwt');
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    fetch('/api/admin/overview', {
      credentials: 'include',
      headers
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch overview metrics');
        return res.json();
      })
      .then((json) => {
        if (json.success) setData(json);
        else throw new Error(json.error || 'Invalid response');
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  if (isLoading && !data) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-white/5 border border-white/5" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-72 rounded-2xl bg-white/5 border border-white/5" />
          <div className="h-72 rounded-2xl bg-white/5 border border-white/5" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center glass-panel rounded-2xl border border-red-500/20 max-w-md mx-auto my-12">
        <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
        <h3 className="font-display font-semibold text-slate-200">Unable to Load Overview</h3>
        <p className="text-xs text-slate-400 mt-1 mb-4">{error}</p>
        <button
          onClick={fetchOverview}
          className="px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 text-xs font-mono transition-colors"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const metrics = data?.metrics || {};

  return (
    <div className="space-y-6">
      {/* Header Refresh Row */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-display font-bold text-slate-100">Overview Dashboard</h2>
          <p className="text-xs font-mono text-slate-400">
            Real recorded metrics across all portfolio sections
          </p>
        </div>

        <button
          onClick={fetchOverview}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-panel glass-panel-hover text-xs font-mono text-slate-300 border border-white/10"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isLoading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Refresh Data</span>
        </button>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <MetricCard
          title="Total Page Views"
          value={metrics.totalViews || 0}
          subtitle="All-time verified views"
          icon={Eye}
          color="cyan"
        />
        <MetricCard
          title="Unique Visitors"
          value={metrics.uniqueVisitors || 0}
          subtitle="Pseudonymous devices"
          icon={Users}
          color="indigo"
        />
        <MetricCard
          title="Visitors Today"
          value={metrics.visitorsToday || 0}
          subtitle="Since 00:00 UTC"
          icon={Calendar}
          color="emerald"
        />
        <MetricCard
          title="Active (30 Mins)"
          value={metrics.activeVisitorsLast30Min || 0}
          subtitle="Recent active sessions"
          icon={Activity}
          color="violet"
        />
        <MetricCard
          title="Top Section"
          value={metrics.topSection || 'Home (/)'}
          subtitle="Highest traffic section"
          icon={Compass}
          color="amber"
        />
        <MetricCard
          title="Top Referral"
          value={metrics.topReferrer || 'Direct'}
          subtitle="Origin channel"
          icon={Share2}
          color="cyan"
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 14-Day Traffic Trend */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-white/10">
          <div className="mb-4">
            <h3 className="font-display font-bold text-slate-100 text-sm">
              14-Day Traffic Trend & Velocity
            </h3>
            <p className="text-xs font-mono text-slate-400">
              Interactive timeline of daily page views vs unique visitors
            </p>
          </div>
          <DailyTrendChart data={data?.dailyTrends || []} />
        </div>

        {/* Device Distribution Donut */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col justify-between">
          <div>
            <h3 className="font-display font-bold text-slate-100 text-sm">
              Device Category Distribution
            </h3>
            <p className="text-xs font-mono text-slate-400">
              Breakdown by client form factor
            </p>
          </div>
          <DeviceDonutChart devices={data?.deviceBreakdown?.devices || []} />
          <div className="text-[10px] text-slate-500 font-mono text-center pt-2 border-t border-white/5">
            Classified from verified User-Agent parameters
          </div>
        </div>
      </div>

      {/* Secondary Row: Popular Pages & Browser/OS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Pages */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10">
          <div className="mb-4">
            <h3 className="font-display font-bold text-slate-100 text-sm">
              Most Visited Sections & Pages
            </h3>
            <p className="text-xs font-mono text-slate-400">
              Ranked by total page views and unique sessions
            </p>
          </div>
          <PopularPagesBarChart pages={data?.popularPages || []} />
        </div>

        {/* Browsers and Operating Systems */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10">
          <div className="mb-4">
            <h3 className="font-display font-bold text-slate-100 text-sm">
              Browser & Operating System Split
            </h3>
            <p className="text-xs font-mono text-slate-400">
              Technical environment of portfolio visitors
            </p>
          </div>
          <BrowserOSChart
            browsers={data?.deviceBreakdown?.browsers || []}
            os={data?.deviceBreakdown?.os || []}
          />
        </div>
      </div>
    </div>
  );
}
