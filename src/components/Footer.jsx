import React, { useState, useEffect } from 'react';
import { personalInfo } from '../data';
import { ArrowUp, Clock, Heart, Shield, Activity, BarChart2 } from 'lucide-react';
import { soundFx } from '../utils/sound';

export default function Footer({ onOpenAdminModal }) {
  const [nagpurTime, setNagpurTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const options = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      const formatter = new Intl.DateTimeFormat([], options);
      setNagpurTime(formatter.format(new Date()));
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const scrollToTop = () => {
    soundFx.playWarp();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-white/10 bg-space-950/80 backdrop-blur-md py-12 px-4 sm:px-6 relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Branding & Academic Affiliation */}
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white font-display font-extrabold text-sm shadow-glow-cyan">
            SK
          </div>
          <div>
            <div className="font-display font-bold text-sm text-slate-100">
              {personalInfo.fullName}
            </div>
            <div className="text-xs font-mono text-slate-400">
              {personalInfo.institution} • B.Tech Batch 2024–28
            </div>
          </div>
        </div>

        {/* Center: Live Nagpur Time */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl glass-panel border border-white/5 text-xs font-mono text-slate-300">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>Nagpur, IN (IST):</span>
          <span className="text-cyan-300 font-bold">{nagpurTime || '10:30:00 AM'}</span>
        </div>

        {/* Right: Views Counter & Back to Top */}
        <div className="flex items-center gap-3">
          {/* Admin Views Counter Button */}
          <button
            onClick={() => {
              soundFx.playClick();
              if (onOpenAdminModal) onOpenAdminModal();
            }}
            className="group flex items-center gap-2 px-3.5 py-2.5 rounded-2xl glass-panel glass-panel-hover border border-cyan-500/30 text-xs font-mono text-cyan-300 hover:text-white shadow-glow-cyan/20 transition-all"
            title="Open Live Views Counter & Admin Telemetry"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
            </span>
            <Activity className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span>Views & Analytics</span>
          </button>

          <button
            onClick={scrollToTop}
            className="group flex items-center gap-2 px-4 py-2.5 rounded-2xl glass-panel glass-panel-hover border border-white/10 text-xs font-mono text-slate-300 hover:text-cyan-300 transition-colors"
          >
            <span>Ascend</span>
            <ArrowUp className="w-4 h-4 transform group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Sub-footer */}
      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-400 gap-2 text-center">
        <div>
          © {new Date().getFullYear()} {personalInfo.name}. All verified credentials archived.
        </div>
        <div className="flex items-center gap-1">
          <span>Engineered with Antigravity Zero-G WebGL Architecture</span>
        </div>
      </div>
    </footer>
  );
}
