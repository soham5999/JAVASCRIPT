import React, { useState, useEffect } from 'react';
import ThreeCanvas from './components/ThreeCanvas';
import CustomCursor from './components/CustomCursor';
import Preloader from './components/Preloader';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Certifications from './components/Certifications';
import Achievements from './components/Achievements';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CommandPalette from './components/CommandPalette';
import PrivacyBanner from './components/PrivacyBanner';
import AdminLayout from './components/admin/AdminLayout';
import { soundFx } from './utils/sound';
import { trackPageView } from './utils/analytics';

export default function App() {
  const [currentPath, setCurrentPath] = useState(
    typeof window !== 'undefined' ? window.location.pathname : '/'
  );
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Sync browser popstate (forward/back buttons and internal pushState)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Theme synchronization
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [isDark]);

  // Client-Side Analytics Ingestion on Initial Load and Hash Navigation
  useEffect(() => {
    // Only track portfolio views (admin dashboard is not tracked as visitor traffic)
    if (!currentPath.startsWith('/admin')) {
      trackPageView(window.location.pathname + (window.location.hash || ''));

      const handleHashChange = () => {
        trackPageView(window.location.pathname + (window.location.hash || ''));
      };

      window.addEventListener('hashchange', handleHashChange);
      return () => window.removeEventListener('hashchange', handleHashChange);
    }
  }, [currentPath]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const toggleSound = () => {
    const newState = soundFx.toggle();
    setIsSoundOn(newState);
  };

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If visiting /admin/analytics or any /admin path, render the protected Admin Dashboard
  if (currentPath.startsWith('/admin')) {
    return (
      <AdminLayout onBackToPortfolio={() => navigateTo('/')} />
    );
  }

  return (
    <div className="relative min-h-screen bg-space-950 text-slate-100 selection:bg-cyan-500 selection:text-white transition-colors duration-500 overflow-x-hidden">
      {/* Intro Preloader */}
      {!isLoaded && <Preloader onComplete={() => setIsLoaded(true)} />}

      {/* Interactive Custom Cursor */}
      <CustomCursor />

      {/* 3D Zero-G WebGL Canvas Background */}
      <ThreeCanvas />

      {/* Subtle Cosmic Grid Background Overlay */}
      <div className="fixed inset-0 bg-cosmic-grid pointer-events-none z-0 opacity-40" />

      {/* Floating Navbar */}
      <Navbar
        isDark={isDark}
        toggleTheme={toggleTheme}
        isSoundOn={isSoundOn}
        toggleSound={toggleSound}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      {/* Main Section Content */}
      <main className="relative z-10 space-y-4">
        <Hero onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Certifications />
        <Achievements />
        <Contact />
      </main>

      {/* Footer */}
      <Footer />

      {/* Privacy Consent Banner */}
      <PrivacyBanner />

      {/* Global Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        isDark={isDark}
        toggleTheme={toggleTheme}
        isSoundOn={isSoundOn}
        toggleSound={toggleSound}
        onNavigateToAdmin={() => navigateTo('/admin/analytics')}
      />
    </div>
  );
}
