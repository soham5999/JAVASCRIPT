import React, { useState, useEffect } from 'react';
import { personalInfo } from '../data';
import { 
  ArrowRight, 
  FileDown, 
  Terminal, 
  Sparkles, 
  ChevronDown, 
  MapPin, 
  GraduationCap, 
  ShieldCheck,
  ExternalLink 
} from 'lucide-react';
import { soundFx } from '../utils/sound';

export default function Hero({ onOpenCommandPalette }) {
  const [typedRoleIndex, setTypedRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const roles = [
    "Computer Science & Data Science Engineer",
    "NLP Researcher • BERT, LSTM & SVM",
    "Data Warehouse Architect • OLAP & ROLLUP",
    "Low-Level Systems • 8051 Assembly Logic"
  ];

  useEffect(() => {
    const current = roles[typedRoleIndex];
    let timeout;

    if (!isDeleting && displayText === current) {
      timeout = setTimeout(() => setIsDeleting(true), 2400);
    } else if (isDeleting && displayText === '') {
      setIsDeleting(false);
      setTypedRoleIndex((prev) => (prev + 1) % roles.length);
    } else {
      timeout = setTimeout(() => {
        setDisplayText(
          isDeleting
            ? current.substring(0, displayText.length - 1)
            : current.substring(0, displayText.length + 1)
        );
      }, isDeleting ? 30 : 65);
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, typedRoleIndex]);

  return (
    <section 
      id="hero" 
      className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-16 px-4 sm:px-6 overflow-hidden"
    >
      {/* Radial Zero-G ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-500/10 via-indigo-600/15 to-purple-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto text-center z-10">
        {/* Availability Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-cyan-500/30 text-xs font-mono text-cyan-300 mb-8 shadow-glow-cyan animate-antigravity">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
          </span>
          <span>{personalInfo.status}</span>
        </div>

        {/* Main Display Headline */}
        <h1 className="font-display font-extrabold text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-white mb-6 leading-[1.08]">
          Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400">{personalInfo.name}</span>
        </h1>

        {/* Dynamic Typewriter Role */}
        <div className="h-10 sm:h-12 flex items-center justify-center font-mono text-base sm:text-xl md:text-2xl text-slate-300 mb-6">
          <span className="text-cyan-400 font-semibold mr-2">&gt;</span>
          <span className="border-r-2 border-cyan-400 pr-1 animate-pulse">
            {displayText}
          </span>
        </div>

        {/* Concise Value Proposition */}
        <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-slate-400 mb-10 leading-relaxed font-normal">
          {personalInfo.tagline}
        </p>

        {/* Key Real Academic Details Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10 text-xs font-mono text-slate-300">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass-panel border border-white/10">
            <GraduationCap className="w-4 h-4 text-cyan-400" />
            <span>SIT Nagpur • B.Tech CSE (Data Science)</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass-panel border border-white/10">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>GPA: <strong className="text-emerald-300">7.7 / 10.0</strong></span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass-panel border border-white/10">
            <MapPin className="w-4 h-4 text-violet-400" />
            <span>Nagpur, Maharashtra</span>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#projects"
            onClick={(e) => {
              e.preventDefault();
              soundFx.playClick();
              document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-display font-semibold text-sm tracking-wide shadow-glow-cyan transition-all duration-300 transform hover:scale-105"
          >
            <span>Explore Projects</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <a
            href={personalInfo.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundFx.playSuccess()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl glass-panel glass-panel-hover text-slate-200 hover:text-white border border-white/15 font-display font-medium text-sm tracking-wide transition-all duration-300"
          >
            <FileDown className="w-4 h-4 text-cyan-400" />
            <span>Download Resume (PDF)</span>
          </a>

          <button
            onClick={() => {
              soundFx.playClick();
              onOpenCommandPalette();
            }}
            className="hidden md:flex items-center gap-2 px-4 py-3.5 rounded-2xl glass-panel glass-panel-hover text-slate-400 hover:text-cyan-300 border border-white/10 text-xs font-mono"
            title="Press Ctrl+K anytime"
          >
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>Press Ctrl+K</span>
          </button>
        </div>

        {/* Floating Quick Tech Orbit Cloud */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-2 max-w-xl mx-auto opacity-75">
          {["Python", "C", "Java", "SQL", "8051 Assembly", "RAG", "BERT NLP", "Star-Schema", "MySQL"].map((tech, idx) => (
            <span
              key={tech}
              className={`px-2.5 py-1 text-[11px] font-mono rounded-lg border border-white/5 bg-white/[0.02] text-slate-400 backdrop-blur-sm transition-transform hover:scale-110 hover:border-cyan-400/40 hover:text-cyan-300 ${
                idx % 2 === 0 ? 'animate-antigravity' : 'animate-antigravity-reverse'
              }`}
              style={{ animationDelay: `${idx * 0.4}s` }}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Floating Scroll Down Indicator */}
      <a
        href="#about"
        onClick={(e) => {
          e.preventDefault();
          soundFx.playClick();
          document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
        }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center text-slate-400 hover:text-cyan-400 transition-colors animate-bounce"
        aria-label="Scroll to About section"
      >
        <span className="text-[10px] font-mono tracking-widest uppercase mb-1">Explore</span>
        <ChevronDown className="w-4 h-4" />
      </a>
    </section>
  );
}
