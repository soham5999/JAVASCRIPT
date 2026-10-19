import React from 'react';
import { achievements } from '../data';
import { Trophy, Award, ShieldCheck, Brain, Star } from 'lucide-react';
import { soundFx } from '../utils/sound';

export default function Achievements() {
  const iconMap = {
    Trophy,
    Award,
    ShieldCheck,
    Brain
  };

  return (
    <section id="achievements" className="py-20 px-4 sm:px-6 relative">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-panel border border-emerald-500/20 text-xs font-mono text-emerald-400 mb-3">
            <Trophy className="w-3.5 h-3.5" />
            <span>HONORS_&_AWARDS // 06</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight">
            Key <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Achievements</span>
          </h2>
          <p className="mt-3 text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
            Recognitions in national challenges, competitive engineering quizzes, and enterprise academic programs.
          </p>
        </div>

        {/* 4-Card Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {achievements.map((item, idx) => {
            const Icon = iconMap[item.icon] || Award;
            return (
              <div
                key={item.title}
                onMouseEnter={() => soundFx.playHover()}
                className="p-6 rounded-3xl glass-panel glass-panel-hover border border-white/10 hover:border-emerald-500/40 transition-all duration-300 shadow-glass flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono text-slate-400">
                      {item.year}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-base text-white mb-1.5 group-hover:text-emerald-300 transition-colors">
                    {item.title}
                  </h3>
                  <div className="text-xs font-mono text-cyan-400 mb-3">
                    {item.organization}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-white/5 flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
                  <Star className="w-3.5 h-3.5 fill-emerald-400" />
                  <span>Verified Distinction</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
