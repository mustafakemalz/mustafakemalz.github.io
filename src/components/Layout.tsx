import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useTranslation } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import CommandMenu from './CommandMenu';
import Icon from './Icon';
import PixelCompanion from './PixelCompanion';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { t, language, toggleLanguage } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [localTime, setLocalTime] = useState<string>('--:--');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const updateClock = () => {
      try {
        const formatted = new Intl.DateTimeFormat('en-GB', {
          timeZone: 'Europe/Istanbul',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }).format(new Date());
        setLocalTime(`${formatted} TRT`);
      } catch {
        const now = new Date();
        setLocalTime(
          `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
        );
      }
    };
    updateClock();
    const timer = window.setInterval(updateClock, 30000);
    return () => window.clearInterval(timer);
  }, []);

  const openMobileMenu = () => {
    setIsMobileMenuOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = '';
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        closeMobileMenu();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    if (isMobileMenuOpen) {
      closeMobileMenu();
    }

    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: targetId } });
      return;
    }

    if (targetId === '#' || targetId === '' || targetId === '#top') {
      if ((window as any).lenis) {
        (window as any).lenis.scrollTo(0, { duration: 1.1 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    const targetEl = document.querySelector(targetId);
    if (targetEl) {
      const navOffset = window.innerWidth <= 768 ? -64 : -72;
      if ((window as any).lenis) {
        (window as any).lenis.scrollTo(targetEl, {
          offset: navOffset,
          duration: 1.1,
        });
      } else {
        const targetY = targetEl.getBoundingClientRect().top + window.scrollY + navOffset;
        window.scrollTo({
          top: targetY,
          behavior: 'smooth',
        });
      }
    }
  };

  const currentYear = new Date().getFullYear();
  const routeSegment =
    location.pathname === '/' ? '' : location.pathname.replace(/^\//, '');

  return (
    <>
      <nav
        className={`site-nav ${isScrolled ? 'is-scrolled' : ''}`}
        id="site-nav"
        aria-label="Main navigation"
      >
        <div className="site-nav-inner">
          <div className="nav-brand-wrap">
            <a href="#" className="nav-brand" onClick={(e) => handleNavClick(e, '#')}>
              Mustafa Kemal
            </a>
            {routeSegment && (
              <span className="nav-route-crumb" aria-hidden="true">
                /{routeSegment}
              </span>
            )}
          </div>
          <div className="nav-links">
            <a href="#about" onClick={(e) => handleNavClick(e, '#about')} data-lang="nav-about">
              {t('nav-about')}
            </a>
            <a href="#experience" onClick={(e) => handleNavClick(e, '#experience')} data-lang="nav-experience">
              {t('nav-experience')}
            </a>
            <a href="#projects" onClick={(e) => handleNavClick(e, '#projects')} data-lang="nav-projects">
              {t('nav-projects')}
            </a>
            <Link to="/journey" onClick={closeMobileMenu} data-lang="nav-journey">
              {t('nav-journey')}
            </Link>
            <a href="#contact" onClick={(e) => handleNavClick(e, '#contact')} data-lang="nav-contact">
              {t('nav-contact')}
            </a>
          </div>
          <div className="nav-actions">
            <button
              type="button"
              id="cmd-btn"
              className="nav-plain-btn"
              onClick={() => setIsCommandOpen(true)}
              aria-label="Open Command Menu (Ctrl+K)"
              title="Command Menu (Ctrl+K)"
            >
              ⌘K
            </button>
            <button
              type="button"
              id="lang-btn"
              className="nav-plain-btn"
              onClick={toggleLanguage}
              aria-label="Change Language"
            >
              {language.toUpperCase()}
            </button>
            <button
              type="button"
              id="theme-btn"
              className="nav-plain-btn"
              onClick={toggleTheme}
              aria-label="Toggle Theme"
            >
              <Icon name={theme === 'light' ? 'sun' : 'moon'} size={15} />
            </button>
            <button
              type="button"
              id="hamburger-btn"
              className={`hamburger-btn ${isMobileMenuOpen ? 'is-active' : ''}`}
              onClick={isMobileMenuOpen ? closeMobileMenu : openMobileMenu}
              aria-label="Toggle Menu"
              aria-expanded={isMobileMenuOpen ? 'true' : 'false'}
            >
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </button>
          </div>
        </div>
      </nav>

      <CommandMenu open={isCommandOpen} onOpenChange={setIsCommandOpen} />

      <div
        className={`mobile-menu-overlay ${isMobileMenuOpen ? 'is-open' : ''}`}
        id="mobile-menu-overlay"
        onClick={(e) => {
          if (e.target === e.currentTarget) closeMobileMenu();
        }}
      >
        <div className="mobile-menu-panel" id="mobile-menu-panel">
          <div className="mobile-menu-links">
            <a href="#about" onClick={(e) => handleNavClick(e, '#about')} data-lang="nav-about">
              {t('nav-about')}
            </a>
            <a href="#experience" onClick={(e) => handleNavClick(e, '#experience')} data-lang="nav-experience">
              {t('nav-experience')}
            </a>
            <a href="#projects" onClick={(e) => handleNavClick(e, '#projects')} data-lang="nav-projects">
              {t('nav-projects')}
            </a>
            <Link to="/journey" onClick={closeMobileMenu} data-lang="nav-journey">
              {t('nav-journey')}
            </Link>
            <a href="#contact" onClick={(e) => handleNavClick(e, '#contact')} data-lang="nav-contact">
              {t('nav-contact')}
            </a>
          </div>
        </div>
      </div>

      <main className="site-wrapper">
        <div key={location.pathname} className="route-transition-stage">
          {children}
        </div>

        <footer className="site-footer reveal">
          <PixelCompanion />
          <div className="footer-row">
            <div className="footer-meta-bar">
              <span>Adana, TR</span>
              <span className="footer-meta-sep">·</span>
              <span>{localTime}</span>
              <span className="footer-meta-sep">·</span>
              <span>© {currentYear} Mustafa Kemal Göçer</span>
            </div>
            <div className="footer-links">
              <a href="https://github.com/mustafakemalz" target="_blank" rel="noopener noreferrer">
                GitHub ↗
              </a>
              <a
                href="https://tr.linkedin.com/in/mustafa-kemal-g%C3%B6%C3%A7er-41409b255"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn ↗
              </a>
              <a href="https://www.instagram.com/jpeg.muskz/" target="_blank" rel="noopener noreferrer">
                Instagram ↗
              </a>
              <Link to="/sistem">{language === 'tr' ? 'Sistem' : 'Setup'}</Link>
              <Link to="/links">Links</Link>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
};
export default Layout;
