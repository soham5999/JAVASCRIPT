import React, { useState, useEffect } from 'react';
import { LayoutGrid, Smartphone, Laptop, Monitor, RefreshCw, FileText } from 'lucide-react';
import { PopularPagesBarChart, DeviceDonutChart, BrowserOSChart } from './Charts';

export default function PagesDevicesTab() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = () => {
    setIsLoading(true);
    const token = localStorage.getItem('ag_admin_jwt');
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    fetch('/api/admin/pages-devices', { credentials: 'include', headers })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setData(json);
      })
      .catch((err) => console.error('Pages & devices fetch error:', err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-display font-bold text-slate-100">Pages, Sections & Client Hardware</h2>
          <p className="text-xs font-mono text-slate-400">
            Granular breakdown of content engagement and visitor tech profiles
          </p>
        </div>

        <button
          onClick={fetchData}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-panel text-xs font-mono text-slate-300 hover:text-cyan-400 border border-white/10"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* All Visited Sections */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10">
          <h3 className="font-display font-bold text-slate-100 text-sm mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            Portfolio Section Engagement
          </h3>
          <PopularPagesBarChart pages={data?.popularPages || []} />
        </div>

        {/* Device Distribution */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col justify-between">
          <div>
            <h3 className="font-display font-bold text-slate-100 text-sm mb-4 flex items-center gap-2">
              <Monitor className="w-4 h-4 text-indigo-400" />
              Device Screen Form Factors
            </h3>
            <DeviceDonutChart devices={data?.deviceBreakdown?.devices || []} />
          </div>

          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/5 text-center text-xs font-mono">
            <div className="p-2 rounded-xl bg-white/5">
              <Laptop className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
              <span className="text-slate-400 block text-[10px]">Desktop</span>
            </div>
            <div className="p-2 rounded-xl bg-white/5">
              <Smartphone className="w-4 h-4 text-violet-400 mx-auto mb-1" />
              <span className="text-slate-400 block text-[10px]">Mobile</span>
            </div>
            <div className="p-2 rounded-xl bg-white/5">
              <Monitor className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
              <span className="text-slate-400 block text-[10px]">Tablet / Other</span>
            </div>
          </div>
        </div>
      </div>

      {/* Browser and Operating System Breakdown */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10">
        <h3 className="font-display font-bold text-slate-100 text-sm mb-4">
          Browser Engines & Operating Systems
        </h3>
        <BrowserOSChart
          browsers={data?.deviceBreakdown?.browsers || []}
          os={data?.deviceBreakdown?.os || []}
        />
      </div>
    </div>
  );
}
