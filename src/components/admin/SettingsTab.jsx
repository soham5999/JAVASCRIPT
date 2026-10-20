import React, { useState } from 'react';
import { KeyRound, Shield, Server, CheckCircle2, AlertTriangle, Lock, Eye, EyeOff } from 'lucide-react';
import { soundFx } from '../../utils/sound';

export default function SettingsTab({ currentUser }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    if (newPassword.length < 8) {
      setMessage({ text: 'New password must be at least 8 characters long.', type: 'error' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ text: 'New passwords do not match.', type: 'error' });
      return;
    }

    setIsUpdating(true);
    soundFx.playClick();
    const token = localStorage.getItem('ag_admin_jwt');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        credentials: 'include',
        headers,
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to change password');

      soundFx.playSuccess();
      setMessage({ text: 'Password successfully updated!', type: 'success' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-display font-bold text-slate-100">Security & Server Configuration</h2>
        <p className="text-xs font-mono text-slate-400">
          Manage administrator credentials, reverse proxy trust, and infrastructure health
        </p>
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-2xl text-xs font-mono flex items-center gap-2.5 animate-fade-in ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
              : 'bg-red-500/10 border border-red-500/30 text-red-300'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          ) : (
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Administrator Profile & Password Update */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-slate-100 text-sm">
                Change Administrator Password
              </h3>
              <p className="text-[11px] font-mono text-slate-400">
                User: <span className="text-cyan-300 font-semibold">{currentUser?.username || 'admin'}</span> (Role: {currentUser?.role || 'admin'})
              </p>
            </div>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4 text-xs font-mono">
            <div>
              <label className="text-[10px] uppercase text-slate-400 block mb-1">
                Current Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Current password"
                className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-200 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase text-slate-400 block mb-1">
                New Secure Password (Min 8 characters)
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New strong password"
                className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-200 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase text-slate-400 block mb-1">
                Confirm New Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-200 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-cyan-400 flex items-center gap-1.5 transition-colors"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showPassword ? 'Hide Passwords' : 'Show Passwords'}</span>
              </button>

              <button
                type="submit"
                disabled={isUpdating}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-space-950 font-semibold transition-all disabled:opacity-50"
              >
                {isUpdating ? 'Saving...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>

        {/* Reverse Proxy & Anti-Spoofing Architecture */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-slate-100 text-sm">
                  Reverse Proxy & Anti-Spoofing Architecture
                </h3>
                <p className="text-[11px] font-mono text-slate-400">
                  Protection against forged client HTTP headers
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Standard web servers that trust <code>X-Forwarded-For</code> unconditionally are vulnerable to header spoofing attacks. Our backend implements a strict zero-trust proxy extractor:
            </p>

            <div className="space-y-2 text-xs font-mono text-slate-300">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-cyan-400 font-semibold block mb-0.5">Standalone / Local Mode (Default)</span>
                Reads socket connection metadata directly (<code>req.socket.remoteAddress</code>). Any client-sent <code>X-Forwarded-For</code> header is explicitly ignored.
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-indigo-400 font-semibold block mb-0.5">Verified Reverse Proxy Mode</span>
                Enabled via <code>TRUST_PROXY=true</code> in <code>.env</code> when running behind Cloudflare, Nginx, or Vercel.
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span>Server Framework: Node.js {process.version}</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
