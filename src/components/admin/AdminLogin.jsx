import React, { useState } from 'react';
import { Lock, Shield, Eye, EyeOff, ArrowRight, AlertTriangle, KeyRound } from 'lucide-react';
import { soundFx } from '../../utils/sound';

export default function AdminLogin({ onLoginSuccess, onBackToPortfolio }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);
    soundFx.playClick();

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      soundFx.playSuccess();
      // Store token in localStorage as backup if cookies are disabled
      if (data.token) {
        localStorage.setItem('ag_admin_jwt', data.token);
      }
      onLoginSuccess(data.user);
    } catch (err) {
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-space-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 bg-cosmic-grid pointer-events-none opacity-30" />
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Card Header & Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white shadow-glow-cyan mb-4">
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-display font-bold text-slate-100 tracking-tight">
            Antigravity Admin Portal
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Private Visitor Analytics & IP Monitoring System
          </p>
        </div>

        {/* Login Box */}
        <div className="glass-panel p-8 rounded-3xl border border-white/10 shadow-glass backdrop-blur-2xl bg-space-900/80">
          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2.5 animate-shake">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">
                Administrator Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-slate-100 text-sm placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">
                Secure Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-4 pr-11 py-3 rounded-xl bg-black/40 border border-white/10 text-slate-100 text-sm placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-display font-semibold text-sm tracking-wide shadow-glow-cyan/50 hover:shadow-glow-cyan transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {isLoading ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Authenticate Session</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between text-xs">
            <button
              onClick={onBackToPortfolio}
              className="text-slate-400 hover:text-cyan-400 transition-colors"
            >
              ← Back to Portfolio
            </button>
            <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>TLS / Rate-Protected</span>
            </span>
          </div>
        </div>

        {/* Security Notice */}
        <p className="text-center text-[11px] font-mono text-slate-500 mt-6 max-w-xs mx-auto">
          Authorized personnel only. All access attempts are rate-limited and logged.
        </p>
      </div>
    </div>
  );
}
