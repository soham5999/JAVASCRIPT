import React, { useState } from 'react';
import { personalInfo } from '../data';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  Check, 
  Copy, 
  Github, 
  Linkedin, 
  Code, 
  Sparkles, 
  CheckCircle2 
} from 'lucide-react';
import { soundFx } from '../utils/sound';
import confetti from 'canvas-confetti';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [copiedField, setCopiedField] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleCopy = (text, field) => {
    soundFx.playClick();
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    soundFx.playSuccess();
    setIsSubmitting(true);

    // Trigger celebratory zero-g confetti burst
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#06b6d4', '#6366f1', '#10b981']
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);

      // Open mailto fallback pre-filled
      const mailtoLink = `mailto:${personalInfo.email}?subject=${encodeURIComponent(
        formData.subject || `Portfolio Inquiry from ${formData.name}`
      )}&body=${encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
      )}`;
      window.location.href = mailtoLink;
    }, 900);
  };

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-cyan-600/10 via-indigo-600/15 to-purple-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-panel border border-cyan-500/20 text-xs font-mono text-cyan-400 mb-3">
            <Mail className="w-3.5 h-3.5" />
            <span>TRANSMISSION_TERMINAL // 07</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight">
            Let's <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400">Collaborate</span>
          </h2>
          <p className="mt-3 text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
            Open for software engineering internships, AI research opportunities, and data engineering projects.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Direct verified channels */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-3xl glass-panel border border-white/10 shadow-glass space-y-6">
              <h3 className="font-display font-bold text-xl text-white">
                Contact Coordinates
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Feel free to reach out directly via email, phone, or explore my code and competitive profiles.
              </p>

              {/* Email Card with Copy Button */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-cyan-500/40 transition-colors flex items-center justify-between group">
                <div className="flex items-center space-x-3 truncate mr-2">
                  <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <div className="text-[11px] font-mono text-slate-400">Direct Email</div>
                    <div className="text-xs sm:text-sm font-semibold text-slate-200 truncate">
                      {personalInfo.email}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(personalInfo.email, 'email')}
                  className="px-3 py-1.5 rounded-xl glass-panel text-xs font-mono text-cyan-300 hover:text-white flex items-center gap-1 shrink-0"
                >
                  {copiedField === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedField === 'email' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Phone Card with Copy Button */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-indigo-500/40 transition-colors flex items-center justify-between group">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] font-mono text-slate-400">Phone (India)</div>
                    <div className="text-xs sm:text-sm font-semibold text-slate-200">
                      {personalInfo.phone}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(personalInfo.phone, 'phone')}
                  className="px-3 py-1.5 rounded-xl glass-panel text-xs font-mono text-indigo-300 hover:text-white flex items-center gap-1 shrink-0"
                >
                  {copiedField === 'phone' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedField === 'phone' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Location Card */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-mono text-slate-400">Campus Location</div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-200">
                    {personalInfo.location}
                  </div>
                </div>
              </div>

              {/* Social Channels Strip */}
              <div className="pt-4 border-t border-white/10">
                <div className="text-xs font-mono text-slate-400 mb-3">
                  Verified Engineering Channels
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <a
                    href={personalInfo.socials.github.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => soundFx.playClick()}
                    className="p-3 rounded-2xl glass-panel glass-panel-hover flex flex-col items-center justify-center gap-1.5 text-slate-300 hover:text-cyan-400 border border-white/5"
                  >
                    <Github className="w-4 h-4" />
                    <span className="text-[10px] font-mono">GitHub</span>
                  </a>

                  <a
                    href={personalInfo.socials.linkedin.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => soundFx.playClick()}
                    className="p-3 rounded-2xl glass-panel glass-panel-hover flex flex-col items-center justify-center gap-1.5 text-slate-300 hover:text-indigo-400 border border-white/5"
                  >
                    <Linkedin className="w-4 h-4" />
                    <span className="text-[10px] font-mono">LinkedIn</span>
                  </a>

                  <a
                    href={personalInfo.socials.hackerrank.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => soundFx.playClick()}
                    className="p-3 rounded-2xl glass-panel glass-panel-hover flex flex-col items-center justify-center gap-1.5 text-slate-300 hover:text-emerald-400 border border-white/5"
                  >
                    <Code className="w-4 h-4" />
                    <span className="text-[10px] font-mono">HackerRank</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Glassmorphism Interactive Message Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl glass-panel border border-white/10 shadow-glass relative">
              <h3 className="font-display font-bold text-xl text-white mb-2">
                Send a Message
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mb-6">
                Direct communication pipeline. Submitting will prepare your email client with verified parameters.
              </p>

              {isSubmitted ? (
                <div className="py-12 text-center space-y-4 animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-glow-cyan">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-display font-bold text-xl text-white">
                    Transmission Dispatched
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                    Thank you, {formData.name}! Your default email client was opened to complete the transmission directly to <strong className="text-cyan-300">{personalInfo.email}</strong>.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({ name: '', email: '', subject: '', message: '' });
                    }}
                    className="mt-4 px-5 py-2.5 rounded-xl glass-panel text-xs font-mono text-cyan-300 hover:text-white"
                  >
                    Send Another Transmission
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Dr. Jane Smith"
                        className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5">
                        Your Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@organization.com"
                        className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Opportunity / Internship / Inquiry"
                      className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Discuss opportunities, research collaborations, or technical questions..."
                      className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors resize-none"
                    />
                  </div>

                  {/* Magnetic Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-display font-semibold text-sm tracking-wide shadow-glow-cyan transition-all duration-300 transform hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        <span>Routing Transmission...</span>
                      </span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Let's Work Together</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
