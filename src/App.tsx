import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { useGlobalScrollReveal } from './hooks/useGlobalScrollReveal';
import Layout from './components/Layout';
import Home from './pages/Home';
import Journey from './pages/Journey';

const AppContent: React.FC = () => {
  useGlobalScrollReveal();
  const { pathname } = useLocation();

  // Scroll restoration on route changes
  useEffect(() => {
    window.scrollTo(0, 0);
    if ((window as any).lenis) {
      (window as any).lenis.scrollTo(0, { immediate: true });
    }
  }, [pathname]);

  // Lenis Smooth Scroll Setup
  useEffect(() => {
    const lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
      smoothWheel: true,
    });

    (window as any).lenis = lenisInstance;

    let rafId: number;
    const raf = (time: number) => {
      lenisInstance.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    let isScrollingTimeout: number;
    const handleScroll = () => {
      const iframe = document.querySelector('.video-embed iframe') as HTMLIFrameElement;
      if (iframe) {
        iframe.style.pointerEvents = 'none';
        window.clearTimeout(isScrollingTimeout);
        isScrollingTimeout = window.setTimeout(() => {
          iframe.style.pointerEvents = 'auto';
        }, 150);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      lenisInstance.destroy();
      window.removeEventListener('scroll', handleScroll);
      (window as any).lenis = undefined;
    };
  }, []);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/journey" element={<Journey />} />
      </Routes>
    </Layout>
  );
};

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <Router>
          <AppContent />
        </Router>
      </ThemeProvider>
    </LanguageProvider>
  );
};

export default App;
