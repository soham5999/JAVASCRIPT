import React, { useState } from 'react';
import { projects } from '../data';
import { 
  FolderGit2, 
  ExternalLink, 
  Github, 
  ArrowUpRight, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  X,
  Code,
  Cpu,
  Database
} from 'lucide-react';
import { soundFx } from '../utils/sound';

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [filter, setFilter] = useState('All');

  const categories = ['All', 'Machine Learning & NLP', 'Data Warehousing', 'Embedded Systems'];

  const filteredProjects = filter === 'All'
    ? projects
    : projects.filter((p) => p.category === filter);

  const handleCardMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -7;
    const rotateY = ((x - centerX) / centerX) * 7;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
  };

  const handleCardMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
  };

  return (
    <section id="projects" className="py-24 px-4 sm:px-6 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-panel border border-cyan-500/20 text-xs font-mono text-cyan-400 mb-3">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>PORTFOLIO_ARTIFACTS // 04</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight">
            Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400">Engineering Work</span>
          </h2>
          <p className="mt-3 text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
            Grounded projects developed for university capstones, enterprise data warehousing labs, and safety-critical hardware architectures.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                soundFx.playClick();
                setFilter(cat);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-mono transition-all duration-300 ${
                filter === cat
                  ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-glow-cyan font-bold'
                  : 'glass-panel text-slate-400 hover:text-white border border-white/5 hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects 3D Parallax Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              onClick={() => {
                soundFx.playClick();
                setSelectedProject(project);
              }}
              className="p-6 sm:p-7 rounded-3xl glass-panel border border-white/10 hover:border-cyan-400/40 transition-all duration-300 cursor-pointer flex flex-col justify-between group shadow-glass relative overflow-hidden"
              style={{ transformStyle: 'preserve-3d', transition: 'transform 0.15s ease-out, border-color 0.3s' }}
            >
              {/* Top Row: Category & Featured Badge */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-mono px-3 py-1 rounded-full border border-white/10 bg-white/5 text-cyan-300">
                    {project.badge}
                  </span>
                  <div className="flex items-center gap-2 text-slate-400 group-hover:text-cyan-400 transition-colors">
                    <span className="text-[11px] font-mono">Details</span>
                    <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>

                {/* Optional Image Preview (e.g. 8051 Simulator) */}
                {project.image && (
                  <div className="mb-4 rounded-xl overflow-hidden border border-white/10 aspect-video bg-space-950">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}

                {/* Title & Subtitle */}
                <h3 className="font-display font-bold text-lg text-white mb-1.5 group-hover:text-cyan-300 transition-colors">
                  {project.title}
                </h3>
                <div className="text-xs font-mono text-indigo-400 mb-3">
                  {project.subtitle}
                </div>

                {/* Summary */}
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6 line-clamp-3">
                  {project.summary}
                </p>
              </div>

              {/* Bottom: Tech Stack Tags & Metrics */}
              <div>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {project.technologies.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/[0.04] text-slate-300 border border-white/5"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 4 && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md text-slate-500">
                      +{project.technologies.length - 4}
                    </span>
                  )}
                </div>

                {/* Real Metrics Row */}
                <div className="pt-3 border-t border-white/5 grid grid-cols-3 gap-2 text-center">
                  {project.metrics.map((m, mIdx) => (
                    <div key={mIdx}>
                      <div className="text-[10px] font-mono text-slate-400 truncate">
                        {m.label}
                      </div>
                      <div className="text-xs font-mono font-bold text-cyan-400 truncate">
                        {m.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Project Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/15 bg-space-900 p-6 sm:p-8 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Close Button */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono border border-cyan-500/40 bg-cyan-500/10 text-cyan-300">
                {selectedProject.badge}
              </span>
              <span className="text-xs font-mono text-slate-400">
                {selectedProject.period}
              </span>
            </div>

            <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white mb-2">
              {selectedProject.title}
            </h3>
            <div className="text-sm font-mono text-cyan-400 mb-4">
              {selectedProject.subtitle} • {selectedProject.guide}
            </div>

            {/* Optional Modal Image Preview */}
            {selectedProject.image && (
              <div className="mb-6 rounded-2xl overflow-hidden border border-white/10">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-auto object-cover max-h-72"
                />
              </div>
            )}

            {/* Full Summary */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-sm text-slate-300 leading-relaxed mb-6">
              {selectedProject.summary}
            </div>

            {/* Architectural & Research Deep Dive */}
            <h4 className="font-display font-bold text-base text-white mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Technical & Architectural Breakdown</span>
            </h4>
            <ul className="space-y-2.5 mb-6 text-sm text-slate-300">
              {selectedProject.details.map((point, pIdx) => (
                <li key={pIdx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            {/* Technologies Used */}
            <h4 className="font-display font-bold text-base text-white mb-3 flex items-center gap-2">
              <Code className="w-4 h-4 text-indigo-400" />
              <span>Technology Stack & Frameworks</span>
            </h4>
            <div className="flex flex-wrap gap-2 mb-8">
              {selectedProject.technologies.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 rounded-xl text-xs font-mono bg-white/5 border border-white/10 text-slate-200"
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-3">
                <a
                  href={selectedProject.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono transition-colors"
                >
                  <Github className="w-4 h-4" />
                  <span>View Repository</span>
                </a>
              </div>

              <button
                onClick={() => setSelectedProject(null)}
                className="px-5 py-2.5 rounded-xl glass-panel text-slate-400 hover:text-white text-xs font-mono"
              >
                Close Modal [Esc]
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
