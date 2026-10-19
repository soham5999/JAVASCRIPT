import React from 'react';
import { education } from '../data';
import { 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  Award,
  Layers,
  Sparkles
} from 'lucide-react';
import { soundFx } from '../utils/sound';

export default function Experience() {
  const timelineItems = [
    {
      type: "Education",
      institution: "Symbiosis Institute of Technology, Nagpur",
      subTitle: "Symbiosis International (Deemed University), Pune",
      role: "B.Tech in Computer Science and Engineering (Data Science)",
      period: "July 2024 – July 2028",
      status: "Currently in 4th Semester (Section B) • GPA 7.7 / 10.0",
      details: [
        "Specializing in Data Science, Machine Learning, and Big Data Architecture.",
        "PRN: 24070521099 with solid academic standing across core engineering cohorts.",
        "Rigorous curriculum covering Data Warehousing, Computer Organization, DBMS, and Operating Systems.",
        "Demonstrated practical competencies in advanced JavaScript lab modules (DOM, AJAX, Closures, LocalStorage)."
      ],
      icon: GraduationCap,
      accent: "cyan"
    },
    {
      type: "Research & Capstone",
      institution: "SIT Department of Computer Science & Engineering",
      subTitle: "Under Guidance of Prof. Dr. Deepak Asudani",
      role: "Lead Researcher • Fake News Detection Architecture",
      period: "Academic Year 2025 – 2026",
      status: "Academic Capstone Research Paper & Report",
      details: [
        "Engineered a multi-paradigm NLP benchmark comparing Support Vector Machines, LSTM, and BERT.",
        "Analyzed linguistic nuances and deceptive token patterns to combat digital misinformation.",
        "Formalized the research report under institutional peer-review and academic standards.",
        "Formulated modular pipelines for dataset cleaning, vectorization, and sequence padding."
      ],
      icon: Sparkles,
      accent: "indigo"
    },
    {
      type: "Laboratory & Systems",
      institution: "Embedded Systems & Hardware Architecture Lab",
      subTitle: "Symbiosis Institute of Technology",
      role: "Microcontroller (8051) Systems & Safety Logic",
      period: "2025 – 2026",
      status: "Hardware Emulation & Memory Algorithms",
      details: [
        "Constructed safety-certified dual-number comparison logic bypassing forbidden SUBB/CJNE instructions.",
        "Built in-place RAM compaction algorithms operating within 40H–5FH without stack or external memory.",
        "Simulated and verified register behavior, zero-flag arbitration, and memory integrity on EdSim51."
      ],
      icon: Layers,
      accent: "violet"
    }
  ];

  return (
    <section id="experience" className="py-24 px-4 sm:px-6 relative">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-panel border border-violet-500/20 text-xs font-mono text-violet-400 mb-3">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>TRAJECTORY // 03</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight">
            Education & <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Milestones</span>
          </h2>
          <p className="mt-3 text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
            Chronological academic journey, supervised university research, and practical laboratory achievements.
          </p>
        </div>

        {/* Vertical Timeline */}
        <div className="relative pl-6 sm:pl-10 border-l border-white/10 space-y-12">
          {timelineItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.role}
                onMouseEnter={() => soundFx.playHover()}
                className="relative group"
              >
                {/* Timeline Neon Pulse Node */}
                <div className={`absolute -left-[31px] sm:-left-[47px] top-1.5 flex items-center justify-center w-8 h-8 rounded-full border bg-space-950 transition-all duration-300 ${
                  item.accent === 'cyan'
                    ? 'border-cyan-400 text-cyan-400 group-hover:shadow-glow-cyan'
                    : item.accent === 'indigo'
                    ? 'border-indigo-400 text-indigo-400 group-hover:shadow-glow-indigo'
                    : 'border-violet-400 text-violet-400 group-hover:shadow-glow-violet'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>

                {/* Card Container */}
                <div className="p-6 sm:p-8 rounded-3xl glass-panel glass-panel-hover border border-white/10 group-hover:border-cyan-500/30 transition-all duration-300">
                  {/* Meta row */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full text-[11px] font-mono font-medium border bg-white/5 border-white/10 text-cyan-300">
                      {item.type}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{item.period}</span>
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="font-display font-bold text-lg sm:text-xl text-white mb-1">
                    {item.role}
                  </h3>
                  <div className="text-sm font-medium text-slate-300 mb-1">
                    {item.institution}
                  </div>
                  <div className="text-xs text-slate-400 mb-4 font-mono">
                    {item.subTitle} • <strong className="text-emerald-400">{item.status}</strong>
                  </div>

                  {/* Details Bullet Points */}
                  <ul className="space-y-2 mt-4 text-xs sm:text-sm text-slate-400">
                    {item.details.map((bullet, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400/80 shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
