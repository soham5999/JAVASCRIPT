import React, { useEffect, useState } from 'react';
import { soundFx } from '../utils/sound';

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing Antigravity Engine...');
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const statuses = [
      { at: 15, text: 'Calibrating SIT Nagpur telemetry...' },
      { at: 40, text: 'Loading BERT & Transformer models...' },
      { at: 65, text: 'Synchronizing OLAP Star-Schema...' },
      { at: 88, text: 'Engaging Zero-Gravity physics...' },
      { at: 100, text: 'Core ready. Welcome, Evaluator.' },
    ];

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsFading(true);
            setTimeout(() => {
              if (onComplete) onComplete();
            }, 600);
          }, 350);
          return 100;
        }

        const next = prev + Math.floor(Math.random() * 8) + 4;
        const capped = Math.min(next, 100);

        const currentStatus = statuses.slice().reverse().find((s) => capped >= s.at);
        if (currentStatus) {
          setStatusText(currentStatus.text);
        }

        return capped;
      });
    }, 45);

    return () => clearInterval(interval);
  }, [onComplete]);

  const handleSkip = () => {
    soundFx.playWarp();
    setIsFading(true);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 400);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-space-950 transition-opacity duration-700 ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="relative w-full max-w-md px-6 text-center">
        {/* Glowing floating orb */}
        <div className="mx-auto mb-8 relative flex items-center justify-center w-24 h-24">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500/30 to-violet-600/30 blur-xl animate-pulse" />
          <div className="w-16 h-16 rounded-2xl border border-cyan-500/40 bg-space-900/80 backdrop-blur-md flex items-center justify-center shadow-glow-cyan animate-antigravity">
            <span className="font-display font-extrabold text-2xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400">
              SK
            </span>
          </div>
        </div>

        {/* Title */}
        <h1 className="font-display text-2xl font-bold tracking-wider text-white mb-2">
          SOHAM KHADATKAR
        </h1>
        <p className="font-mono text-xs uppercase tracking-widest text-cyan-400/80 mb-6">
          PORTFOLIO TELEMETRY // BATCH 2024–28
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-space-850 rounded-full h-1.5 overflow-hidden border border-white/5 mb-3">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 transition-all duration-150 ease-out shadow-glow-cyan"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Stats & Status */}
        <div className="flex justify-between items-center text-xs font-mono text-slate-400 px-1">
          <span className="truncate pr-2 text-slate-400">{statusText}</span>
          <span className="text-cyan-400 font-bold">{progress}%</span>
        </div>

        {/* Quick Skip Button */}
        <button
          onClick={handleSkip}
          className="mt-8 text-xs font-mono tracking-widest text-slate-500 hover:text-cyan-300 transition-colors uppercase border border-white/5 hover:border-cyan-500/30 px-3 py-1.5 rounded-full backdrop-blur-sm"
        >
          Skip Intro [Space / Click]
        </button>
      </div>
    </div>
  );
}
