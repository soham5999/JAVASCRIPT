import React, { useState, useEffect } from 'react';
import { 
  personalInfo, 
  navigationLinks 
} from '../data';
import { 
  FileDown, 
  Menu, 
  X, 
  Moon, 
  Sun, 
  Volume2, 
  VolumeX, 
  Terminal, 
  Sparkles 
} from 'lucide-react';
import { soundFx } from '../utils/sound';

export default function Navbar({ isDark, toggleTheme, isSoundOn, toggleSound, onOpenCommandPalette }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);

      const sections = ['hero', ...navigationLinks.map((l) => l.href.replace('#', ''))];
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href) => {
    soundFx.playClick();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-6 py-4 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
        {/* Brand / Logo */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            soundFx.playClick();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="group flex items-center space-x-3 px-3.5 py-2 rounded-2xl glass-panel glass-panel-hover border border-white/10"
        >
          <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white font-display font-bold text-sm shadow-glow-cyan">
            <span>SK</span>
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-display font-bold tracking-wider text-slate-100 group-hover:text-cyan-400 transition-colors">
              {personalInfo.name}
            </div>
            <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
              <span>SIT Nagpur</span>
              <span className="text-cyan-400">•</span>
              <span className="text-emerald-400 font-semibold">GPA {personalInfo.gpa}</span>
            </div>
          </div>
        </a>

        {/* Center Pill Navigation (Desktop) */}
        <nav className="hidden lg:flex items-center space-x-1 px-3 py-1.5 rounded-full glass-panel border border-white/10 shadow-glass">
          {navigationLinks.map((link) => {
            const isActive = activeSection === link.href.replace('#', '');
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                onMouseEnter={() => soundFx.playHover()}
                className={`relative px-3.5 py-1.5 text-xs font-medium rounded-full transition-all duration-300 ${
                  isActive
                    ? 'text-cyan-300 bg-white/10 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <span className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 -z-10 animate-pulse" />
                )}
                {link.name}
              </a>
            );
          })}
        </nav>

        {/* Right Action Tools */}
        <div className="flex items-center space-x-2">
          {/* Command Palette Button */}
          <button
            onClick={() => {
              soundFx.playClick();
              onOpenCommandPalette();
            }}
            title="Open Command Palette (Ctrl+K)"
            className="hidden sm:flex items-center space-x-1.5 px-3 py-2 rounded-xl glass-panel glass-panel-hover text-xs font-mono text-slate-300 border border-white/10"
          >
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>Cmd</span>
            <kbd className="px-1.5 py-0.5 text-[10px] bg-white/10 rounded text-slate-400">Ctrl+K</kbd>
          </button>

          {/* Sound FX Toggle */}
          <button
            onClick={() => {
              toggleSound();
              soundFx.playClick();
            }}
            title={isSoundOn ? 'Mute Sounds' : 'Enable Acoustic FX'}
            className="p-2 rounded-xl glass-panel glass-panel-hover text-slate-400 hover:text-cyan-300 border border-white/10"
          >
            {isSoundOn ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => {
              toggleTheme();
              soundFx.playClick();
            }}
            title="Toggle Dark/Light Mode"
            className="p-2 rounded-xl glass-panel glass-panel-hover text-slate-400 hover:text-amber-400 border border-white/10"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Resume Download CTA */}
          <a
            href={personalInfo.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundFx.playSuccess()}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-medium font-display tracking-wide shadow-glow-cyan transition-all duration-300 transform hover:scale-105"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Resume</span>
          </a>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => {
              soundFx.playClick();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="lg:hidden p-2 rounded-xl glass-panel text-slate-300 border border-white/10"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 p-4 rounded-2xl glass-panel border border-white/10 pointer-events-auto animate-fade-in shadow-2xl">
          <div className="flex flex-col space-y-2">
            {navigationLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-200 hover:bg-white/10 hover:text-cyan-400 transition-colors"
              >
                {link.name}
              </a>
            ))}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCommandPalette();
              }}
              className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium text-cyan-400 bg-white/5 hover:bg-white/10"
            >
              <span>Command Palette</span>
              <kbd className="px-2 py-0.5 text-xs bg-white/10 rounded text-slate-300">Ctrl+K</kbd>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
