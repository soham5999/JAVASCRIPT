import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Trash2, Download, RefreshCw, AlertTriangle, 
  Lock, CheckCircle2, Sliders, Database, EyeOff 
} from 'lucide-react';
import { soundFx } from '../../utils/sound';

export default function PrivacyRetentionTab() {
  const [settings, setSettings] = useState({
    collect_raw_ip: false,
    retention_days: 60,
    anonymize_mode: 'truncate',
    trust_proxy: false,
    respect_dnt: true
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });

  // Cleanup & Purge states
  const [isCleaning, setIsCleaning] = useState(false);
  const [purgeConfirmation, setPurgeConfirmation] = useState('');
  const [showPurgeModal, setShowPurgeModal] = useState(false);
  const [isPurging, setIsPurging] = useState(false);

  const fetchSettings = () => {
    setIsLoading(true);
    const token = localStorage.getItem('ag_admin_jwt');
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    fetch('/api/admin/settings', { credentials: 'include', headers })
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.settings) {
          setSettings(json.settings);
        }
      })
      .catch((err) => console.error('Fetch settings error:', err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage({ text: '', type: '' });
    soundFx.playClick();

    const token = localStorage.getItem('ag_admin_jwt');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        credentials: 'include',
        headers,
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save settings');

      soundFx.playSuccess();
      setStatusMessage({ text: 'Privacy & retention settings updated successfully.', type: 'success' });
    } catch (err) {
      setStatusMessage({ text: err.message, type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleManualCleanup = async () => {
    setIsCleaning(true);
    soundFx.playClick();
    const token = localStorage.getItem('ag_admin_jwt');
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const res = await fetch('/api/admin/cleanup', {
        method: 'POST',
        credentials: 'include',
        headers
      });
      const data = await res.json();
      soundFx.playSuccess();
      setStatusMessage({
        text: `Cleanup successful: ${data.result?.deletedCount || 0} expired records older than ${settings.retention_days} days were purged.`,
        type: 'success'
      });
    } catch (err) {
      setStatusMessage({ text: 'Cleanup failed.', type: 'error' });
    } finally {
      setIsCleaning(false);
    }
  };

  const handleExport = (format = 'json') => {
    soundFx.playClick();
    const token = localStorage.getItem('ag_admin_jwt');
    const url = `/api/admin/export?format=${format}${token ? `&token=${encodeURIComponent(token)}` : ''}`;
    window.open(url, '_blank');
  };

  const handlePurgeAll = async () => {
    if (purgeConfirmation !== 'DELETE_ALL_ANALYTICS_DATA') {
      alert('Please type the exact confirmation phrase to proceed.');
      return;
    }

    setIsPurging(true);
    soundFx.playClick();
    const token = localStorage.getItem('ag_admin_jwt');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const res = await fetch('/api/admin/data', {
        method: 'DELETE',
        credentials: 'include',
        headers,
        body: JSON.stringify({ confirmation: purgeConfirmation })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to purge data');

      soundFx.playSuccess();
      setShowPurgeModal(false);
      setPurgeConfirmation('');
      setStatusMessage({ text: data.message || 'All records wiped.', type: 'success' });
    } catch (err) {
      alert(err.message);
    } finally {
      setIsPurging(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-display font-bold text-slate-100">Privacy, Retention & Data Governance</h2>
        <p className="text-xs font-mono text-slate-400">
          Configure GDPR/CCPA compliance, IP pseudonymization, automated retention, and data exports
        </p>
      </div>

      {statusMessage.text && (
        <div
          className={`p-4 rounded-2xl text-xs font-mono flex items-center gap-2.5 animate-fade-in ${
            statusMessage.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
              : 'bg-red-500/10 border border-red-500/30 text-red-300'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          ) : (
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSaveSettings} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: IP Privacy & Masking */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-slate-100 text-sm">
                  IP Collection & Masking Policy
                </h3>
                <p className="text-[11px] font-mono text-slate-400">
                  Configure raw vs pseudonymized address storage
                </p>
              </div>
            </div>

            {/* Toggle: Collect Raw IP */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-200 block">
                    Collect Full Raw IP Address
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Disabled by default. Requires explicit legal basis under GDPR/ePrivacy.
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.collect_raw_ip}
                    onChange={(e) =>
                      setSettings({ ...settings, collect_raw_ip: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>

              {settings.collect_raw_ip && (
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-mono">
                  ⚠️ Notice: Storing raw IP addresses identifies network endpoints. Ensure your posted privacy policy reflects this processing.
                </div>
              )}
            </div>

            {/* Anonymize Mode */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-300 uppercase tracking-wider block">
                Anonymization Algorithm (When Raw IP is Disabled)
              </label>
              <select
                value={settings.anonymize_mode}
                onChange={(e) => setSettings({ ...settings, anonymize_mode: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400"
              >
                <option value="truncate">
                  Truncation (e.g. 192.168.1.xxx - recommended, zero reversible linkage)
                </option>
                <option value="hash">
                  Daily-Salted Pseudonymization (HMAC-SHA256 with rotating salt)
                </option>
              </select>
            </div>

            {/* DNT / GPC */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/5">
              <div>
                <span className="text-xs font-semibold text-slate-200 block">
                  Honor Do Not Track (DNT & GPC) Signals
                </span>
                <span className="text-[11px] text-slate-400">
                  Automatically drop metrics when browser sends privacy headers
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.respect_dnt}
                onChange={(e) => setSettings({ ...settings, respect_dnt: e.target.checked })}
                className="w-4 h-4 rounded text-cyan-500 bg-black/40 border-white/20 focus:ring-cyan-500"
              />
            </div>
          </div>

          {/* Card 2: Retention Schedule */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-slate-100 text-sm">
                  Automated Data Retention Policy
                </h3>
                <p className="text-[11px] font-mono text-slate-400">
                  Enforce strict data minimization timelines
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300">Retention Horizon:</span>
                <span className="text-cyan-400 font-bold">{settings.retention_days} Days</span>
              </div>

              <input
                type="range"
                min="7"
                max="365"
                step="1"
                value={settings.retention_days}
                onChange={(e) =>
                  setSettings({ ...settings, retention_days: parseInt(e.target.value, 10) })
                }
                className="w-full accent-cyan-400"
              />

              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>7 Days (Minimal)</span>
                <span>60 Days (Default)</span>
                <span>365 Days (Max)</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Our automated daemon cleans up expired events once on server start and every 24 hours thereafter. Records older than the configured horizon are permanently removed.
            </p>

            <button
              type="button"
              onClick={handleManualCleanup}
              disabled={isCleaning}
              className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-slate-300 hover:text-cyan-300 border border-white/10 transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 className={`w-3.5 h-3.5 ${isCleaning ? 'animate-spin' : ''}`} />
              <span>{isCleaning ? 'Purging Expired Records...' : 'Trigger Retention Cleanup Now'}</span>
            </button>
          </div>
        </div>

        {/* Save Settings CTA */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-display font-semibold text-xs tracking-wide shadow-glow-cyan/40 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            <span>Save Governance Configuration</span>
          </button>
        </div>
      </form>

      {/* Export & Purge Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t border-white/10">
        {/* Export Data */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-slate-100 text-sm">
                Authorized Data Export
              </h3>
              <p className="text-[11px] font-mono text-slate-400">
                Download visitor records for backup or offline auditing
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-300">
            Export all verified page views and session logs currently stored in your database.
          </p>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => handleExport('json')}
              className="flex-1 py-2.5 px-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export as JSON</span>
            </button>
            <button
              onClick={() => handleExport('csv')}
              className="flex-1 py-2.5 px-3 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-mono font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export as CSV</span>
            </button>
          </div>
        </div>

        {/* Permanent Data Wipe (Danger Zone) */}
        <div className="glass-panel p-6 rounded-3xl border border-red-500/20 bg-red-950/10 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-red-200 text-sm">
                Purge All Analytics Records
              </h3>
              <p className="text-[11px] font-mono text-red-400/80">
                Permanent, irreversible wipe of all telemetry
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-300">
            Instantly deletes 100% of recorded page views and visitor history from the database.
          </p>

          <button
            type="button"
            onClick={() => setShowPurgeModal(true)}
            className="w-full py-2.5 px-4 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 text-xs font-mono font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Purge All Stored Data</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal for Purge */}
      {showPurgeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="glass-panel max-w-md w-full rounded-3xl border border-red-500/30 p-6 bg-space-950 text-slate-200 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-display font-bold text-lg text-white">Confirm Permanent Wipe</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              This action cannot be undone. All visitor events, statistics, and IP history will be completely erased.
            </p>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-slate-400 block">
                Type <strong>DELETE_ALL_ANALYTICS_DATA</strong> to confirm:
              </label>
              <input
                type="text"
                value={purgeConfirmation}
                onChange={(e) => setPurgeConfirmation(e.target.value)}
                placeholder="DELETE_ALL_ANALYTICS_DATA"
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-red-500/30 text-xs font-mono text-red-300 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  setShowPurgeModal(false);
                  setPurgeConfirmation('');
                }}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-slate-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={purgeConfirmation !== 'DELETE_ALL_ANALYTICS_DATA' || isPurging}
                onClick={handlePurgeAll}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold shadow-lg disabled:opacity-40 transition-all flex items-center gap-2"
              >
                {isPurging && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                <span>Confirm & Wipe Everything</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
