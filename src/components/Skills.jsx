import React, { useState } from 'react';
import { skillsCategories } from '../data';
import { 
  Code2, 
  BrainCircuit, 
  Database, 
  Terminal, 
  Sparkles, 
  CheckCircle2, 
  Layers,
  Cpu
} from 'lucide-react';
import { soundFx } from '../utils/sound';

export default function Skills() {
  const [activeTab, setActiveTab] = useState('all');

  const iconsMap = {
    Code2,
    BrainCircuit,
    Database,
    Terminal
  };

  const filteredCategories = activeTab === 'all'
    ? skillsCategories
    : skillsCategories.filter((cat) => cat.category.toLowerCase().includes(activeTab.toLowerCase()));

  return (
    <section id="skills" className="py-24 px-4 sm:px-6 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-panel border border-indigo-500/20 text-xs font-mono text-indigo-400 mb-3">
            <Cpu className="w-3.5 h-3.5" />
            <span>TECHNICAL_MATRIX // 02</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight">
            Skills & <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">Capabilities</span>
          </h2>
          <p className="mt-3 text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
            Verified competencies spanning low-level microcontroller arithmetic, statistical data modeling, and deep learning architectures.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-14">
          {[
            { id: 'all', label: 'All Dimensions' },
            { id: 'languages', label: 'Languages' },
            { id: 'data science', label: 'AI & Data Science' },
            { id: 'warehousing', label: 'Data Warehousing' },
            { id: 'systems', label: 'Systems & Tools' }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  soundFx.playClick();
                  setActiveTab(tab.id);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-mono tracking-wide transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-glow-indigo font-bold'
                    : 'glass-panel text-slate-400 hover:text-white border border-white/5 hover:border-white/20'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredCategories.map((category) => {
            const HeaderIcon = iconsMap[category.icon] || Code2;
            return (
              <div
                key={category.category}
                className="p-6 sm:p-8 rounded-3xl glass-panel border border-white/10 hover:border-indigo-500/40 transition-all duration-300 shadow-glass relative overflow-hidden group"
              >
                {/* Header */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-glow-indigo">
                    <HeaderIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-white">
                      {category.category}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {category.description}
                    </p>
                  </div>
                </div>

                {/* Skills Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                  {category.skills.map((skill) => (
                    <div
                      key={skill.name}
                      onMouseEnter={() => soundFx.playHover()}
                      className="p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 hover:border-cyan-400/40 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-glow-cyan/20 group/item"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-display font-semibold text-sm text-slate-200 group-hover/item:text-cyan-300 transition-colors">
                          {skill.name}
                        </span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                          skill.level === 'Certified'
                            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                            : skill.level === 'Advanced'
                            ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                            : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
                        }`}>
                          {skill.level}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 group-hover/item:text-slate-300 leading-snug">
                        {skill.highlight}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Real Certification Callout Strip */}
        <div className="mt-12 p-6 rounded-3xl glass-panel border border-cyan-500/20 flex flex-col md:flex-row items-center justify-between gap-4 shadow-glow-cyan/10">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="font-display font-bold text-sm text-white">
                Industry-Accredited Curriculum & Credentials
              </div>
              <div className="text-xs text-slate-400">
                Coursework verified by Red Hat (AD141), IBM SkillsBuild (RAG & Data), and Tata Group.
              </div>
            </div>
          </div>
          <a
            href="#certifications"
            onClick={(e) => {
              e.preventDefault();
              soundFx.playClick();
              document.getElementById('certifications')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-5 py-2.5 rounded-xl glass-panel glass-panel-hover text-cyan-300 hover:text-white border border-cyan-500/30 text-xs font-mono font-medium"
          >
            Explore Verified Gallery →
          </a>
        </div>
      </div>
    </section>
  );
}
