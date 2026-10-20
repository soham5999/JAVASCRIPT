import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Radio, ListFilter, Share2, 
  Smartphone, ShieldCheck, Settings, LogOut, ArrowLeft, 
  Menu, X, Sparkles, Clock, Globe, Shield 
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

export default function AdminLayout({ onBackToPortfolio }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentUser, setCurrentUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check auth session
  useEffect(() => {
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
  }, []);

  const handleLogout = async () => {
    soundFx.playClick();
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch {
      // Ignore
    }
    localStorage.removeItem('ag_admin_jwt');
    setCurrentUser(null);
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-space-950 text-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 font-mono text-xs text-slate-400">
          <span className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <span>Verifying security credentials...</span>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <AdminLogin
        onLoginSuccess={(user) => setCurrentUser(user)}
        onBackToPortfolio={onBackToPortfolio}
      />
    );
  }

  const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <div className="min-h-screen bg-space-950 text-slate-100 flex relative overflow-x-hidden selection:bg-cyan-500 selection:text-white">
      {/* Background Ambience */}
      <div className="fixed inset-0 bg-cosmic-grid pointer-events-none opacity-25 z-0" />
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-cyan-600/5 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Desktop Sidebar Navigation */}
      <aside className="hidden lg:flex flex-col justify-between w-64 border-r border-white/10 glass-panel bg-space-950/80 p-5 z-20 shrink-0 sticky top-0 h-screen">
        <div className="space-y-6">
          {/* Dashboard Header / Brand */}
          <div className="flex items-center gap-3 px-2">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white font-display font-bold text-base shadow-glow-cyan">
              <span>AG</span>
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
              </span>
            </div>
            <div>
              <h1 className="font-display font-bold text-sm tracking-wide text-slate-100">
                Antigravity
              </h1>
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block">
                Visitor Telemetry
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
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
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/30 shadow-glow-cyan/20 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="space-y-3 pt-4 border-t border-white/10">
          <div className="px-2 text-[11px] font-mono text-slate-400">
            <span className="text-slate-500 block text-[10px] uppercase">Logged in as</span>
            <span className="text-slate-200 font-semibold">{currentUser.username}</span>
          </div>

          <button
            onClick={onBackToPortfolio}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-cyan-300 hover:bg-white/5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Portfolio</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 glass-panel bg-space-950/70 border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl glass-panel text-slate-300 border border-white/10"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono text-slate-300">
                Active Node: <span className="text-cyan-400 font-semibold">Cluster A</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            {/* Timezone display */}
            <div className="hidden sm:flex items-center gap-1.5 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>{localTimezone}</span>
            </div>

            <button
              onClick={onBackToPortfolio}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-panel glass-panel-hover text-slate-300 hover:text-cyan-400 border border-white/10"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Portfolio</span>
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden glass-panel bg-space-950/95 border-b border-white/10 p-4 space-y-2 animate-fade-in">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-mono ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            <div className="pt-2 border-t border-white/10 flex justify-between">
              <button
                onClick={onBackToPortfolio}
                className="text-xs font-mono text-cyan-400"
              >
                ← Back to Portfolio
              </button>
              <button
                onClick={handleLogout}
                className="text-xs font-mono text-red-400"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}

        {/* Tab Content Rendering */}
        <main className="p-4 sm:p-8 flex-1 max-w-7xl w-full mx-auto">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'live' && <LiveActivityTab />}
          {activeTab === 'logs' && <VisitorLogsTab />}
          {activeTab === 'sources' && <TrafficSourcesTab />}
          {activeTab === 'pages' && <PagesDevicesTab />}
          {activeTab === 'privacy' && <PrivacyRetentionTab />}
          {activeTab === 'settings' && <SettingsTab currentUser={currentUser} />}
        </main>
      </div>
    </div>
  );
}
