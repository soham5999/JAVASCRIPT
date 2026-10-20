import React from 'react';

const colorThemes = {
  cyan: {
    border: 'border-cyan-500/30',
    glow: 'hover:border-cyan-400/50 hover:shadow-glow-cyan',
    iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    badge: 'bg-cyan-500/15 text-cyan-300'
  },
  indigo: {
    border: 'border-indigo-500/30',
    glow: 'hover:border-indigo-400/50 hover:shadow-glow-indigo',
    iconBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    badge: 'bg-indigo-500/15 text-indigo-300'
  },
  violet: {
    border: 'border-violet-500/30',
    glow: 'hover:border-violet-400/50 hover:shadow-glow-violet',
    iconBg: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    badge: 'bg-violet-500/15 text-violet-300'
  },
  emerald: {
    border: 'border-emerald-500/30',
    glow: 'hover:border-emerald-400/50 hover:shadow-[0_0_35px_-5px_rgba(16,185,129,0.3)]',
    iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    badge: 'bg-emerald-500/15 text-emerald-300'
  },
  amber: {
    border: 'border-amber-500/30',
    glow: 'hover:border-amber-400/50 hover:shadow-[0_0_35px_-5px_rgba(245,158,11,0.3)]',
    iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    badge: 'bg-amber-500/15 text-amber-300'
  }
};

export default function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'cyan',
  trend = null
}) {
  const theme = colorThemes[color] || colorThemes.cyan;

  return (
    <div
      className={`glass-panel p-5 rounded-2xl border ${theme.border} ${theme.glow} transition-all duration-300 relative overflow-hidden group`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
            {title}
          </span>
          <div className="text-2xl sm:text-3xl font-display font-bold text-slate-100 tracking-tight">
            {value}
          </div>
        </div>

        {Icon && (
          <div className={`p-3 rounded-xl border ${theme.iconBg} shrink-0 transition-transform group-hover:scale-110 duration-300`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
          <span>{subtitle}</span>
          {trend && (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-medium ${theme.badge}`}>
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
