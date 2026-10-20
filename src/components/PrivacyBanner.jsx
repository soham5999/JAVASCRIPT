import React, { useState, useEffect } from 'react';
import { ShieldCheck, Info, X, Check, Lock, EyeOff } from 'lucide-react';
import { getConsentStatus, setConsentStatus, trackPageView } from '../utils/analytics';
import { soundFx } from '../utils/sound';

export default function PrivacyBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const status = getConsentStatus();
    if (!status) {
      // Delay display slightly for smooth page load
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    soundFx.playSuccess();
    setConsentStatus('granted');
    setIsVisible(false);
    setShowModal(false);
    trackPageView();
  };

  const handleDecline = () => {
    soundFx.playClick();
    setConsentStatus('denied');
    setIsVisible(false);
    setShowModal(false);
  };

  if (!isVisible && !showModal) return null;

  return (
    <>
      {/* Floating Bottom Privacy Banner */}
      {isVisible && !showModal && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-fade-in">
          <div className="glass-panel p-4 rounded-2xl border border-cyan-500/20 shadow-glow-cyan/20 backdrop-blur-xl bg-space-950/85 text-slate-200">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0 mt-0.5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="flex-1 text-xs space-y-2">
                <div className="font-display font-semibold text-slate-100 flex items-center justify-between">
                  <span>Privacy-Conscious Analytics</span>
                  <button
                    onClick={handleDecline}
                    className="text-slate-400 hover:text-slate-200 p-0.5"
                    title="Dismiss"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  We collect privacy-first, cookieless metrics (approximate country, device category, and pages visited) to understand technical traffic. Raw IP storage is disabled by default.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={handleAccept}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-medium text-xs shadow-sm transition-all"
                  >
                    Accept
                  </button>
                  <button
                    onClick={handleDecline}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 font-medium text-xs transition-colors"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setShowModal(true);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 transition-colors"
                    title="Privacy Policy Details"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Privacy Transparency Policy Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="glass-panel max-w-xl w-full rounded-2xl border border-white/15 p-6 bg-space-950/95 text-slate-200 max-h-[85vh] overflow-y-auto space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-slate-100">Analytics & Privacy Disclosure</h3>
                  <p className="text-xs text-slate-400">Zero Invasive Tracking Policy</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-cyan-200">
                <span className="font-semibold block mb-1">Our Core Commitment:</span>
                We do not use tracking cookies, we do not perform invasive device fingerprinting, and we never sell or share visitor data with third-party advertisers.
              </div>

              <div>
                <h4 className="font-semibold text-slate-100 mb-1 flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400" /> What Technical Data Is Collected
                </h4>
                <ul className="list-disc list-inside space-y-1 text-slate-300 pl-1">
                  <li><strong>Pseudonymous Visitor ID:</strong> A randomly generated token stored locally to distinguish new vs returning visits.</li>
                  <li><strong>Sanitized Page Path:</strong> The portfolio section viewed (e.g. <code>/#projects</code>). All query parameters and tokens are stripped before saving.</li>
                  <li><strong>Referring Source:</strong> Domain of the external website you arrived from (e.g. <code>github.com</code> or Direct).</li>
                  <li><strong>Approximate Geolocation:</strong> Estimated country, region, and city resolved on our server via an offline GeoIP database. Coarse only; never precision home coordinates.</li>
                  <li><strong>Technical Categories:</strong> Browser family, operating system, and screen category (Desktop, Tablet, Mobile).</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-slate-100 mb-1 flex items-center gap-1.5">
                  <EyeOff className="w-4 h-4 text-indigo-400" /> IP Address Protection & Anonymization
                </h4>
                <p>
                  By default, raw IP addresses are <strong>disabled and not stored</strong>. IP addresses are truncated (e.g., <code>192.168.1.xxx</code>) or pseudonymized using a salted hash. Full IP collection is strictly optional and only active if the site administrator explicitly enables it in compliance with applicable law.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-100 mb-1">Data Retention & Automatic Deletion</h4>
                <p>
                  All event records are subject to an automated retention schedule (default 60 days). Records older than the configured threshold are permanently purged. The site owner can also manually trigger an instant complete data wipe.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                onClick={handleDecline}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium transition-colors"
              >
                Opt Out
              </button>
              <button
                onClick={handleAccept}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-semibold shadow-glow-cyan/50 transition-all"
              >
                Accept & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
