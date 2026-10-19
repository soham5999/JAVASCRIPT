import React, { useState } from 'react';
import { certifications } from '../data';
import { 
  Award, 
  ExternalLink, 
  FileCheck, 
  ShieldCheck, 
  Brain, 
  Database, 
  Trophy, 
  CheckCircle2, 
  Clock, 
  X,
  Eye
} from 'lucide-react';
import { soundFx } from '../utils/sound';

export default function Certifications() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeModalCert, setActiveModalCert] = useState(null);

  const categories = ['All', 'AI & Data Science', 'Systems & Python', 'Competitions'];

  const filteredCerts = activeCategory === 'All'
    ? certifications
    : certifications.filter((c) => c.category === activeCategory);

  const getIssuerBadgeStyle = (issuer) => {
    if (issuer.includes('Red Hat')) return 'border-red-500/40 text-red-400 bg-red-500/10';
    if (issuer.includes('IBM')) return 'border-blue-500/40 text-blue-400 bg-blue-500/10';
    if (issuer.includes('Tata')) return 'border-indigo-500/40 text-indigo-400 bg-indigo-500/10';
    return 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10';
  };

  return (
    <section id="certifications" className="py-24 px-4 sm:px-6 relative overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-panel border border-amber-500/20 text-xs font-mono text-amber-400 mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>ACCREDITED_CREDENTIALS // 05</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight">
            Verified <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-purple-400 to-cyan-400">Certifications Gallery</span>
          </h2>
          <p className="mt-3 text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
            Formal technical qualifications issued by enterprise leaders and academic systems of record.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                soundFx.playClick();
                setActiveCategory(cat);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-mono transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-amber-500 to-indigo-600 text-white shadow-glow-indigo font-bold'
                  : 'glass-panel text-slate-400 hover:text-white border border-white/5 hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery 3D Floating Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCerts.map((cert) => (
            <div
              key={cert.id}
              onMouseEnter={() => soundFx.playHover()}
              className="p-6 rounded-3xl glass-panel glass-panel-hover border border-white/10 hover:border-cyan-400/40 flex flex-col justify-between group shadow-glass relative"
            >
              <div>
                {/* Top: Issuer Badge & Date */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium border ${getIssuerBadgeStyle(cert.issuer)}`}>
                    {cert.issuer}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {cert.date}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-display font-bold text-base sm:text-lg text-white mb-2 group-hover:text-cyan-300 transition-colors">
                  {cert.title}
                </h3>

                {/* Partner / System of Record */}
                <div className="text-xs font-mono text-slate-400 mb-3">
                  {cert.partner}
                </div>

                {/* Description */}
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {cert.description}
                </p>
              </div>

              {/* Bottom: Credential ID & Actions */}
              <div>
                <div className="flex items-center justify-between py-2 border-t border-white/5 text-[11px] font-mono text-slate-400 mb-4">
                  <span>ID: <strong className="text-slate-300">{cert.credentialId}</strong></span>
                  {cert.learningHours && (
                    <span className="flex items-center gap-1 text-cyan-400">
                      <Clock className="w-3 h-3" />
                      {cert.learningHours}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {cert.isLocalPdf ? (
                    <button
                      onClick={() => {
                        soundFx.playSuccess();
                        setActiveModalCert(cert);
                      }}
                      className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-medium transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Certificate</span>
                    </button>
                  ) : (
                    <a
                      href={cert.verificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => soundFx.playSuccess()}
                      className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-mono font-medium transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Verify Credential</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certificate Viewer Modal */}
      {activeModalCert && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in"
          onClick={() => setActiveModalCert(null)}
        >
          <div
            className="w-full max-w-4xl h-[85vh] rounded-3xl border border-white/15 bg-space-900 p-6 flex flex-col shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div>
                <h3 className="font-display font-bold text-lg text-white">
                  {activeModalCert.title}
                </h3>
                <div className="text-xs font-mono text-cyan-400">
                  {activeModalCert.issuer} • ID: {activeModalCert.credentialId}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={activeModalCert.verificationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in Tab</span>
                </a>
                <button
                  onClick={() => setActiveModalCert(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-white/5 hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Embedded PDF iframe */}
            <div className="flex-1 w-full rounded-2xl overflow-hidden bg-space-950 border border-white/5">
              <iframe
                src={activeModalCert.verificationUrl}
                title={activeModalCert.title}
                className="w-full h-full border-none"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
