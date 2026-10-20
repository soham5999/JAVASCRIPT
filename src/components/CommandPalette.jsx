import React, { useState, useEffect } from 'react';
import { 
  Search, 
  X, 
  FileDown, 
  Mail, 
  ExternalLink, 
  Sparkles, 
  Moon, 
  Sun, 
  Volume2, 
  VolumeX, 
  Award, 
  Cpu, 
  FolderGit2, 
  Layers,
  ShieldCheck
} from 'lucide-react';
import { soundFx } from '../utils/sound';
import confetti from 'canvas-confetti';

export default function CommandPalette({ isOpen, onClose, isDark, toggleTheme, isSoundOn, toggleSound, onNavigateToAdmin }) {
  const [query, setQuery] = useState('');

  const actions = [
    {
      id: 'projects',
      title: 'Navigate to Projects',
      category: 'Navigation',
      icon: FolderGit2,
      action: () => {
        document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
        onClose();
      }
    },
    {
      id: 'certifications',
      title: 'Navigate to Certifications',
      category: 'Navigation',
      icon: Award,
      action: () => {
        document.getElementById('certifications')?.scrollIntoView({ behavior: 'smooth' });
        onClose();
      }
    },
    {
      id: 'skills',
      title: 'Navigate to Skills Matrix',
      category: 'Navigation',
      icon: Cpu,
      action: () => {
        document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' });
        onClose();
      }
    },
    {
      id: 'experience',
      title: 'Navigate to Experience & SIT Nagpur',
      category: 'Navigation',
      icon: Layers,
      action: () => {
        document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' });
        onClose();
      }
    },
    {
      id: 'contact',
      title: 'Contact Soham Khadatkar',
      category: 'Navigation',
      icon: Mail,
      action: () => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        onClose();
      }
    },
    {
      id: 'resume',
      title: 'Download Official Resume PDF',
      category: 'Quick Action',
      icon: FileDown,
      action: () => {
        window.open('/Soham_Khadatkar_Resume.pdf', '_blank');
        onClose();
      }
    },
    {
      id: 'theme',
      title: `Switch to ${isDark ? 'Light' : 'Dark'} Mode`,
      category: 'Preferences',
      icon: isDark ? Sun : Moon,
      action: () => {
        toggleTheme();
        onClose();
      }
    },
    {
      id: 'sound',
      title: `${isSoundOn ? 'Mute' : 'Enable'} UI Sound Effects`,
      category: 'Preferences',
      icon: isSoundOn ? VolumeX : Volume2,
      action: () => {
        toggleSound();
        onClose();
      }
    },
    {
      id: 'admin-analytics',
      title: 'Open Visitor Analytics & IP Dashboard (Private)',
      category: 'Administration',
      icon: ShieldCheck,
      action: () => {
        if (onNavigateToAdmin) {
          onNavigateToAdmin();
        } else {
          window.history.pushState({}, '', '/admin/analytics');
          window.dispatchEvent(new PopStateEvent('popstate'));
        }
        onClose();
      }
    },
    {
      id: 'easter-egg',
      title: 'Launch Antigravity Zero-G Burst (Easter Egg)',
      category: 'Surprise',
      icon: Sparkles,
      action: () => {
        soundFx.playWarp();
        confetti({
          particleCount: 120,
          spread: 90,
          origin: { y: 0.6 },
          colors: ['#06b6d4', '#6366f1', '#a855f7', '#ec4899', '#ffffff']
        });
        onClose();
      }
    }
  ];

  const filtered = actions.filter(
    (a) => a.title.toLowerCase().includes(query.toLowerCase()) || a.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        soundFx.playClick();
        if (isOpen) onClose();
        else setQuery('');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div 
        className="w-full max-w-xl rounded-2xl border border-white/10 bg-space-900/90 shadow-2xl shadow-cyan-950/50 backdrop-blur-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center border-b border-white/10 px-4 py-3">
          <Search className="w-5 h-5 text-cyan-400 mr-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commands, navigate sections, trigger actions... (Type 'zero-g')"
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-400 focus:outline-none"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-white/5">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-400">
              No matching commands found.
            </div>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    soundFx.playSuccess();
                    item.action();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left hover:bg-white/5 transition-colors group text-sm"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-white/5 text-cyan-400 group-hover:bg-cyan-500/20 group-hover:text-cyan-300 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-slate-200 group-hover:text-white font-medium">
                        {item.title}
                      </div>
                      <div className="text-xs text-slate-500 group-hover:text-slate-400">
                        {item.category}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-slate-500 group-hover:text-cyan-400">
                    ↵ Execute
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between px-4 py-2 bg-space-950/80 border-t border-white/5 text-[11px] font-mono text-slate-400">
          <span>Use <strong>Ctrl+K</strong> anywhere</span>
          <span>Press <strong>Esc</strong> to dismiss</span>
        </div>
      </div>
    </div>
  );
}
