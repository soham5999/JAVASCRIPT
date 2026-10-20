import React, { useState, useEffect } from 'react';
import { X, Globe, Laptop, Clock, Shield, Calendar, ArrowRight, Activity, MapPin } from 'lucide-react';

export default function VisitorDrawer({ visitor, onClose }) {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!visitor?.visitor_id) return;

    let isMounted = true;
    setIsLoading(true);

    const token = localStorage.getItem('ag_admin_jwt');
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    fetch(`/api/admin/visitors/${encodeURIComponent(visitor.visitor_id)}/history`, {
      credentials: 'include',
      headers
    })
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.success) {
          setHistory(data.events || []);
        }
      })
      .catch((err) => console.error('Failed to load visitor history:', err))
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [visitor?.visitor_id]);

  if (!visitor) return null;

  const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const formatLocalTime = (utcStr) => {
    try {
      const d = new Date(utcStr);
      return d.toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'medium'
      });
    } catch {
      return utcStr;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg glass-panel bg-space-950/95 border-l border-white/10 p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
          {/* Header */}
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-slate-100">
                    Visitor Session Details
                  </h3>
                  <p className="text-[11px] font-mono text-slate-400">
                    ID: {visitor.visitor_id.substring(0, 18)}...
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Metadata Grid */}
            <div className="grid grid-cols-2 gap-3 my-5 text-xs font-mono">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-slate-400 text-[10px] uppercase block mb-1 flex items-center gap-1">
                  <Shield className="w-3 h-3 text-cyan-400" /> Server-Observed IP
                </span>
                <span className="text-slate-200 font-semibold">{visitor.ip_address || 'Not Recorded'}</span>
                <span className="text-[10px] text-cyan-300 block mt-0.5">
                  Mode: {visitor.ip_mode || 'anonymized'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-slate-400 text-[10px] uppercase block mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-indigo-400" /> Approx. Location
                </span>
                <span className="text-slate-200 font-semibold truncate block">
                  {visitor.city ? `${visitor.city}, ` : ''}{visitor.country_name || visitor.country || 'Unknown'}
                </span>
                <span className="text-[10px] text-amber-300 block mt-0.5">
                  *Coarse GeoIP Estimate
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-slate-400 text-[10px] uppercase block mb-1 flex items-center gap-1">
                  <Laptop className="w-3 h-3 text-emerald-400" /> Device & Browser
                </span>
                <span className="text-slate-200 font-semibold truncate block">
                  {visitor.browser} on {visitor.os}
                </span>
                <span className="text-[10px] text-slate-400 capitalize block mt-0.5">
                  Type: {visitor.device_type}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-slate-400 text-[10px] uppercase block mb-1 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-violet-400" /> Visit Status
                </span>
                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                  visitor.visit_type === 'returning' 
                    ? 'bg-violet-500/20 text-violet-300' 
                    : 'bg-emerald-500/20 text-emerald-300'
                }`}>
                  {visitor.visit_type === 'returning' ? 'Returning Visitor' : 'New Visitor'}
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">
                  TZ: {localTimezone}
                </span>
              </div>
            </div>

            {/* Event Timeline */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                Session Event History ({history.length} Events)
              </h4>

              {isLoading ? (
                <div className="py-8 text-center text-slate-500 font-mono text-xs flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                  <span>Loading history...</span>
                </div>
              ) : history.length === 0 ? (
                <div className="py-6 text-center text-slate-500 font-mono text-xs">
                  No subsequent events recorded.
                </div>
              ) : (
                <div className="space-y-3 relative before:absolute before:inset-0 before:left-2.5 before:w-0.5 before:bg-white/10 pl-6">
                  {history.map((ev, idx) => (
                    <div key={ev.id || idx} className="relative group">
                      <div className="absolute -left-[19px] top-1.5 w-2.5 h-2.5 rounded-full bg-cyan-400 border-2 border-space-950 group-hover:scale-125 transition-transform" />
                      <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono font-semibold text-cyan-300 truncate max-w-[200px]">
                            {ev.path}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400" title={`UTC: ${ev.timestamp_utc}`}>
                            {formatLocalTime(ev.timestamp_utc)}
                          </span>
                        </div>
                        {ev.referrer && ev.referrer !== 'Direct' && (
                          <div className="text-[11px] font-mono text-slate-400 mt-1 truncate">
                            Ref: {ev.referrer}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer Transparency Notice */}
          <div className="pt-4 border-t border-white/10 text-[11px] text-slate-500 font-mono">
            ⚠️ Privacy notice: IP addresses are server-observed and never deanonymized. Geolocation is an approximation based on regional ISP allocations.
          </div>
        </div>
      </div>
    </div>
  );
}
