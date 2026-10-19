import React from 'react';
import { personalInfo, stats } from '../data';
import { 
  GraduationCap, 
  MapPin, 
  FileText, 
  CheckCircle, 
  BookOpen, 
  Binary, 
  Database, 
  Award,
  ExternalLink
} from 'lucide-react';
import { soundFx } from '../utils/sound';

export default function About() {
  return (
    <section id="about" className="py-24 px-4 sm:px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-panel border border-cyan-500/20 text-xs font-mono text-cyan-400 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
            <span>SYSTEM_PROFILE // 01</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">Soham</span>
          </h2>
          <p className="mt-3 text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
            Grounded in computer science fundamentals, bridging raw hardware registers with scalable data architectures and language models.
          </p>
        </div>

        {/* Grid: Photo & Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          {/* Left Column: Portrait & Orbital Badges */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-72 sm:w-80 aspect-[4/5] rounded-3xl p-1.5 bg-gradient-to-tr from-cyan-500/40 via-indigo-500/20 to-purple-500/40 shadow-2xl shadow-indigo-950/50">
              {/* Outer atmospheric aura */}
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 rounded-3xl blur-2xl -z-10 animate-pulse-glow" />

              {/* Photo Container */}
              <div className="relative w-full h-full rounded-[22px] overflow-hidden bg-space-900 border border-white/10 group">
                <img
                  src={personalInfo.profileImage}
                  alt={personalInfo.name}
                  className="w-full h-full object-cover object-top filter grayscale-[15%] contrast-105 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                />

                {/* Bottom glass overlay with name */}
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-space-950 via-space-950/80 to-transparent">
                  <div className="font-display font-bold text-white text-base">
                    {personalInfo.fullName}
                  </div>
                  <div className="text-xs font-mono text-cyan-400">
                    PRN: {personalInfo.prn}
                  </div>
                </div>
              </div>

              {/* Floating Orbital Badge 1: Education */}
              <div className="absolute -top-4 -left-4 sm:-left-6 px-3.5 py-2 rounded-2xl glass-panel border border-cyan-500/40 text-xs font-mono text-cyan-300 shadow-glow-cyan animate-antigravity">
                <div className="flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-cyan-400" />
                  <span>SIT Nagpur '28</span>
                </div>
              </div>

              {/* Floating Orbital Badge 2: GPA */}
              <div className="absolute -bottom-4 -right-4 sm:-right-6 px-3.5 py-2 rounded-2xl glass-panel border border-emerald-500/40 text-xs font-mono text-emerald-300 shadow-glass animate-antigravity-reverse">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>GPA 7.7 / 10.0</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Grounded Biography */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
              <p>
                I am a 4th-semester undergraduate pursuing my <strong className="text-white">B.Tech in Computer Science and Engineering (Data Science)</strong> at <span className="text-cyan-300 font-medium">Symbiosis Institute of Technology (SIT), Nagpur</span>, a constituent of Symbiosis International University, Pune.
              </p>
              <p>
                My engineering focus is driven by two intertwined dimensions: <strong className="text-white">low-level systems precision</strong> and <strong className="text-white">intelligent data architectures</strong>. In low-level microcontroller systems (8051 assembly), I engineer deterministic solutions like safety-certified time-to-zero decrements and in-place two-pointer RAM defragmenters that operate under strict zero-overhead constraints.
              </p>
              <p>
                In the data science realm, I explore <strong className="text-white">Retrieval-Augmented Generation (RAG)</strong>, multi-level hierarchical <strong className="text-white">OLAP star schemas</strong>, and transformer architectures (BERT, LSTM, SVM) for combating online misinformation under the mentorship of senior SIT faculty.
              </p>
            </div>

            {/* Core Values / Strengths Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl glass-panel border border-white/5 hover:border-cyan-500/30 transition-colors">
                <div className="flex items-center gap-2 text-cyan-400 font-display font-semibold text-sm mb-1">
                  <Binary className="w-4 h-4" />
                  <span>Zero-Overhead Systems</span>
                </div>
                <p className="text-xs text-slate-400 leading-normal">
                  Crafting deterministic memory algorithms and register-level logic without wasteful abstraction penalties.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl glass-panel border border-white/5 hover:border-indigo-500/30 transition-colors">
                <div className="flex items-center gap-2 text-indigo-400 font-display font-semibold text-sm mb-1">
                  <Database className="w-4 h-4" />
                  <span>Dimensional Modeling</span>
                </div>
                <p className="text-xs text-slate-400 leading-normal">
                  Building star schemas, Fact-Dimension aggregations, and MySQL ROLLUP pipelines for decision analytics.
                </p>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href={personalInfo.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundFx.playSuccess()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-display text-xs font-semibold shadow-glow-cyan transition-all transform hover:scale-105"
              >
                <FileText className="w-4 h-4" />
                <span>View Full Curriculum Vitae</span>
              </a>

              <a
                href={personalInfo.socials.github.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl glass-panel text-slate-300 hover:text-white border border-white/10 text-xs font-mono transition-colors"
              >
                <span>GitHub Repositories</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Real Metrics Counter Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <div
              key={stat.label}
              className="p-6 rounded-3xl glass-panel glass-panel-hover border border-white/10 text-center relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-cyan-500/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />
              <div className="font-display font-extrabold text-3xl sm:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 mb-2">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-200 mb-1">
                {stat.label}
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                {stat.detail}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
