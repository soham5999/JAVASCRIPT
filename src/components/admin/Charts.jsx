import React, { useState } from 'react';

/**
 * Interactive SVG 14-Day Traffic Trend Chart
 */
export function DailyTrendChart({ data = [] }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-slate-500 font-mono text-xs">
        <span>No traffic history recorded yet.</span>
        <span className="text-[10px] text-slate-600 mt-1">Visit your portfolio sections to generate events.</span>
      </div>
    );
  }

  const height = 200;
  const width = 600;
  const paddingX = 40;
  const paddingY = 30;

  const maxVal = Math.max(1, ...data.map((d) => Math.max(d.views || 0, d.uniques || 0)));
  const stepX = data.length > 1 ? (width - paddingX * 2) / (data.length - 1) : 0;

  // Generate path points
  const pointsViews = data.map((d, i) => {
    const x = paddingX + i * stepX;
    const y = height - paddingY - ((d.views || 0) / maxVal) * (height - paddingY * 2);
    return { x, y, ...d };
  });

  const pointsUniques = data.map((d, i) => {
    const x = paddingX + i * stepX;
    const y = height - paddingY - ((d.uniques || 0) / maxVal) * (height - paddingY * 2);
    return { x, y, ...d };
  });

  const dViewsLine = pointsViews.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');
  const dViewsArea = pointsViews.length > 0
    ? `${dViewsLine} L ${pointsViews[pointsViews.length - 1].x} ${height - paddingY} L ${pointsViews[0].x} ${height - paddingY} Z`
    : '';

  const dUniquesLine = pointsUniques.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-4 text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-cyan-400 inline-block shadow-sm" />
            <span className="text-slate-300 font-mono text-[11px]">Total Page Views</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-indigo-400 inline-block shadow-sm" />
            <span className="text-slate-300 font-mono text-[11px]">Unique Visitors</span>
          </div>
        </div>

        {hoveredIndex !== null && pointsViews[hoveredIndex] && (
          <div className="font-mono text-xs text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-3 py-1 rounded-lg">
            {pointsViews[hoveredIndex].date}: {pointsViews[hoveredIndex].views} views (
            {pointsUniques[hoveredIndex]?.uniques || 0} unique)
          </div>
        )}
      </div>

      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-56 overflow-visible">
          <defs>
            <linearGradient id="areaGradientViews" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="lineGradientViews" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const y = height - paddingY - ratio * (height - paddingY * 2);
            return (
              <g key={idx}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="rgba(255, 255, 255, 0.07)"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingX - 10}
                  y={y + 3}
                  textAnchor="end"
                  className="fill-slate-500 text-[9px] font-mono"
                >
                  {Math.round(ratio * maxVal)}
                </text>
              </g>
            );
          })}

          {/* Views Area & Line */}
          {dViewsArea && <path d={dViewsArea} fill="url(#areaGradientViews)" />}
          {dViewsLine && (
            <path
              d={dViewsLine}
              fill="none"
              stroke="url(#lineGradientViews)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Uniques Line */}
          {dUniquesLine && (
            <path
              d={dUniquesLine}
              fill="none"
              stroke="#818cf8"
              strokeWidth="2"
              strokeDasharray="4 3"
              strokeLinecap="round"
            />
          )}

          {/* Interactive Data Dots */}
          {pointsViews.map((p, idx) => (
            <g key={idx} onMouseEnter={() => setHoveredIndex(idx)} onMouseLeave={() => setHoveredIndex(null)}>
              <circle
                cx={p.x}
                cy={p.y}
                r={hoveredIndex === idx ? 6 : 3.5}
                className={`fill-cyan-400 stroke-space-950 stroke-2 cursor-pointer transition-all duration-200 ${
                  hoveredIndex === idx ? 'filter drop-shadow-[0_0_8px_#06b6d4]' : ''
                }`}
              />
              {/* X-axis date labels */}
              {(idx === 0 || idx === Math.floor(pointsViews.length / 2) || idx === pointsViews.length - 1) && (
                <text
                  x={p.x}
                  y={height - 8}
                  textAnchor="middle"
                  className="fill-slate-400 text-[10px] font-mono"
                >
                  {p.date ? p.date.substring(5) : ''}
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

/**
 * Popular Pages Horizontal Meter Chart
 */
export function PopularPagesBarChart({ pages = [] }) {
  if (!pages || pages.length === 0) {
    return (
      <div className="py-8 text-center text-slate-500 font-mono text-xs">
        No page visit records yet.
      </div>
    );
  }

  const maxViews = Math.max(1, ...pages.map((p) => p.views || 0));

  return (
    <div className="space-y-3">
      {pages.map((page) => {
        const percentage = Math.round(((page.views || 0) / maxViews) * 100);
        return (
          <div key={page.path} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-slate-200 truncate max-w-[200px] sm:max-w-xs" title={page.path}>
                {page.path}
              </span>
              <div className="flex items-center gap-2 font-mono text-[11px]">
                <span className="text-cyan-400 font-semibold">{page.views} views</span>
                <span className="text-slate-500">({page.unique_visitors} unique)</span>
              </div>
            </div>
            <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-violet-500 transition-all duration-500"
                style={{ width: `${Math.max(4, percentage)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Interactive SVG Device Distribution Donut Chart
 */
export function DeviceDonutChart({ devices = [] }) {
  const total = devices.reduce((sum, d) => sum + (d.count || 0), 0);

  if (total === 0) {
    return (
      <div className="py-8 text-center text-slate-500 font-mono text-xs">
        No device metrics yet.
      </div>
    );
  }

  const colors = {
    desktop: '#06b6d4',
    mobile: '#8b5cf6',
    tablet: '#10b981',
    unknown: '#64748b'
  };

  let cumulativeAngle = 0;
  const radius = 42;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
      <div className="relative w-36 h-36 shrink-0">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          {devices.map((d) => {
            const fraction = d.count / total;
            const strokeDasharray = `${fraction * circumference} ${circumference}`;
            const strokeDashoffset = -cumulativeAngle * circumference;
            cumulativeAngle += fraction;
            const color = colors[d.device_type] || '#38bdf8';

            return (
              <circle
                key={d.device_type}
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke={color}
                strokeWidth="14"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-500"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-xl font-display font-bold text-slate-100">{total}</span>
          <span className="text-[10px] font-mono text-slate-400 uppercase">Sessions</span>
        </div>
      </div>

      <div className="space-y-2 text-xs font-mono w-full max-w-[200px]">
        {devices.map((d) => {
          const pct = Math.round((d.count / total) * 100);
          const color = colors[d.device_type] || '#38bdf8';
          return (
            <div key={d.device_type} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-slate-300 capitalize">{d.device_type}</span>
              </div>
              <span className="text-slate-400 font-semibold">{pct}% ({d.count})</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Browser & OS Horizontal Split Bars
 */
export function BrowserOSChart({ browsers = [], os = [] }) {
  const totalBrowsers = browsers.reduce((sum, b) => sum + (b.count || 0), 0);
  const totalOs = os.reduce((sum, o) => sum + (o.count || 0), 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Browsers */}
      <div className="space-y-2">
        <span className="text-[11px] font-mono uppercase text-slate-400 block mb-2">
          Top Browsers
        </span>
        {browsers.length === 0 ? (
          <p className="text-xs text-slate-500 font-mono">No browser data</p>
        ) : (
          browsers.map((b) => {
            const pct = totalBrowsers > 0 ? Math.round((b.count / totalBrowsers) * 100) : 0;
            return (
              <div key={b.browser} className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">{b.browser}</span>
                  <span className="text-cyan-400">{pct}% ({b.count})</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full rounded-full bg-cyan-500" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* OS */}
      <div className="space-y-2">
        <span className="text-[11px] font-mono uppercase text-slate-400 block mb-2">
          Top Operating Systems
        </span>
        {os.length === 0 ? (
          <p className="text-xs text-slate-500 font-mono">No OS data</p>
        ) : (
          os.map((o) => {
            const pct = totalOs > 0 ? Math.round((o.count / totalOs) * 100) : 0;
            return (
              <div key={o.os} className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">{o.os}</span>
                  <span className="text-indigo-400">{pct}% ({o.count})</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full rounded-full bg-indigo-500" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
