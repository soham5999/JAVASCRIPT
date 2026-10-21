import React, { useState, useEffect } from 'react';
import { 
  X, LayoutDashboard, Radio, ListFilter, Share2, 
  Smartphone, ShieldCheck, Settings, LogOut, Clock, 
  Eye, Users, Calendar, Activity, Lock, RefreshCw, Shield 
} from 'lucide-react';
import AdminLogin from './AdminLogin';
import OverviewTab from './OverviewTab';
import LiveActivityTab from './LiveActivityTab';
import VisitorLogsTab from './VisitorLogsTab';
import TrafficSourcesTab from './TrafficSourcesTab';
import PagesDevicesTab from './PagesDevicesTab';
import PrivacyRetentionTab from './PrivacyRetentionTab';
import SettingsTab from './SettingsTab';
import { soundFx } from '../../utils/sound';

const navigationItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'live', label: 'Live Activity', icon: Radio },
  { id: 'logs', label: 'Visitor Logs', icon: ListFilter },
  { id: 'sources', label: 'Traffic Sources', icon: Share2 },
  { id: 'pages', label: 'Pages & Devices', icon: Smartphone },
  { id: 'privacy', label: 'Privacy & Retention', icon: ShieldCheck },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function AdminModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentUser, setCurrentUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [quickMetrics, setQuickMetrics] = useState(null);
  const [isQuickMetricsLoading, setIsQuickMetricsLoading] = useState(false);

  // Check auth session whenever modal opens
  useEffect(() => {
    if (!isOpen) return;

    setIsCheckingAuth(true);
    const token = localStorage.getItem('ag_admin_jwt');
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    fetch('/api/auth/me', { credentials: 'include', headers })
      .then((res) => {
        if (!res.ok) throw new Error('Unauthenticated');
        return res.json();
      })
      .then((data) => {
        if (data.authenticated && data.user) {
          setCurrentUser(data.user);
          loadQuickMetrics();
        } else {
          setCurrentUser(null);
        }
      })
      .catch(() => {
        setCurrentUser(null);
      })
      .finally(() => {
        setIsCheckingAuth(false);
      });
  }, [isOpen]);

  // Load quick view counter metrics
  const loadQuickMetrics = () => {
    setIsQuickMetricsLoading(true);
    const token = localStorage.getItem('ag_admin_jwt');
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    fetch('/api/admin/overview', { credentials: 'include', headers })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.metrics) {
          setQuickMetrics(data.metrics);
        }
      })
      .catch((err) => console.error('Failed to load metrics:', err))
      .finally(() => setIsQuickMetricsLoading(false));
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleLogout = async () => {
    soundFx.playClick();
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch {
      // Ignore
    }
    localStorage.removeItem('ag_admin_jwt');
    setCurrentUser(null);
    setQuickMetrics(null);
  };

  if (!isOpen) return null;

  const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Blurred Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={() => {
          soundFx.playClick();
          onClose();
        }}
      />

      {/* Main Popup Modal Window */}
      <div className="relative w-full max-w-6xl max-h-[92vh] glass-panel bg-space-950/95 border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10 animate-fade-in">
        {/* Top Header Bar */}
        <div className="px-5 sm:px-8 py-4 border-b border-white/10 flex items-center justify-between shrink-0 bg-space-900/60 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white font-display font-bold text-sm shadow-glow-cyan">
              <span>AG</span>
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-sm sm:text-base text-slate-100">
                  Antigravity Telemetry & Views
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  Private Admin Portal
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400 hidden sm:block">
                Real-time traffic metrics, visitor activity & IP telemetry
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 text-xs font-mono">
            {currentUser && (
              <>
                <div className="hidden md:flex items-center gap-1.5 text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{localTz}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 text-red-300 hover:bg-red-500/20 text-xs font-mono transition-colors border border-red-500/20"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </>
            )}

            <button
              onClick={() => {
                soundFx.playClick();
                onClose();
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Close Popup (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto">
          {isCheckingAuth ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 font-mono text-xs text-slate-400">
              <span className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              <span>Verifying admin authentication session...</span>
            </div>
          ) : !currentUser ? (
            /* Login Form inside the popup */
            <div className="p-6 sm:p-12 max-w-md mx-auto">
              <AdminLogin
                onLoginSuccess={(user) => {
                  setCurrentUser(user);
                  loadQuickMetrics();
                }}
                onBackToPortfolio={onClose}
              />
            </div>
          ) : (
            /* Authenticated Admin Views & Dashboard */
            <div className="p-4 sm:p-8 space-y-6">
              {/* Prominent Views Counter Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 rounded-2xl glass-panel border border-cyan-500/30 bg-cyan-950/20 relative overflow-hidden">
                  <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono uppercase mb-1">
                    <span>Total Views</span>
                    <Eye className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-display font-bold text-cyan-300">
                    {quickMetrics?.totalViews ?? (isQuickMetricsLoading ? '...' : 0)}
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                    Verified page loads
                  </span>
                </div>

                <div className="p-4 rounded-2xl glass-panel border border-indigo-500/30 bg-indigo-950/20 relative overflow-hidden">
                  <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono uppercase mb-1">
                    <span>Unique Visitors</span>
                    <Users className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-display font-bold text-indigo-300">
                    {quickMetrics?.uniqueVisitors ?? (isQuickMetricsLoading ? '...' : 0)}
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                    Pseudonymous devices
                  </span>
                </div>

                <div className="p-4 rounded-2xl glass-panel border border-emerald-500/30 bg-emerald-950/20 relative overflow-hidden">
                  <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono uppercase mb-1">
                    <span>Visitors Today</span>
                    <Calendar className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-display font-bold text-emerald-300">
                    {quickMetrics?.visitorsToday ?? (isQuickMetricsLoading ? '...' : 0)}
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                    Since 00:00 UTC
                  </span>
                </div>

                <div className="p-4 rounded-2xl glass-panel border border-violet-500/30 bg-violet-950/20 relative overflow-hidden">
                  <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono uppercase mb-1">
                    <span>Active (<span className="text-emerald-400">Live</span>)</span>
                    <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-display font-bold text-emerald-400">
                    {quickMetrics?.activeVisitorsLast30Min ?? (isQuickMetricsLoading ? '...' : 0)}
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                    Within last 30 minutes
                  </span>
                </div>
              </div>

              {/* Navigation Tabs Pill Strip */}
              <div className="flex items-center gap-1.5 p-1.5 rounded-2xl glass-panel border border-white/10 overflow-x-auto">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        soundFx.playClick();
                        setActiveTab(item.id);
                      }}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/30 shadow-glow-cyan/20 font-semibold'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Active Tab View */}
              <div className="mt-4">
                {activeTab === 'overview' && <OverviewTab />}
                {activeTab === 'live' && <LiveActivityTab />}
                {activeTab === 'logs' && <VisitorLogsTab />}
                {activeTab === 'sources' && <TrafficSourcesTab />}
                {activeTab === 'pages' && <PagesDevicesTab />}
                {activeTab === 'privacy' && <PrivacyRetentionTab />}
                {activeTab === 'settings' && <SettingsTab currentUser={currentUser} />}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
