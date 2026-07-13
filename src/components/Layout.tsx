import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useTranslation } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import DiscordWidget from './DiscordWidget';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { t, language, toggleLanguage } = useTranslation();
  const { toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle navbar scroll background toggle
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle mobile menu ESC key close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMobileMenu();
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const openMobileMenu = () => setIsMobileMenuOpen(true);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    closeMobileMenu();

    const isHomePage = location.pathname === '/';

    if (isHomePage) {
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        if ((window as any).lenis) {
          (window as any).lenis.scrollTo(targetEl, {
            offset: -72,
            duration: 1.2,
          });
        } else {
          const targetY = targetEl.getBoundingClientRect().top + window.scrollY - 72;
          window.scrollTo({
            top: targetY,
            behavior: 'smooth',
          });
        }
      }
    } else {
      // Navigate to home and pass target element via state
      navigate('/', { state: { scrollTo: targetId } });
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <>
      {/* ═══════════════ STICKY NAVIGATION ═══════════════ */}
      <nav
        id="site-nav"
        className={`site-nav ${isScrolled ? 'is-scrolled' : ''}`}
        aria-label="Main navigation"
      >
        <Link to="/" onClick={(e) => handleNavClick(e, '#')} className="nav-brand">
          Mustafa Kemal
        </Link>
        <div className="nav-links" id="nav-links">
          <a href="#about" onClick={(e) => handleNavClick(e, '#about')} data-lang="nav-about">
            {t('nav-about')}
          </a>
          <a href="#services" onClick={(e) => handleNavClick(e, '#services')} data-lang="nav-skills">
            {t('nav-skills')}
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
          <Link to="/sistem" onClick={closeMobileMenu} data-lang="sistem-hero-badge">
            {t('sistem-hero-badge')}
          </Link>
          <a href="#stream" onClick={(e) => handleNavClick(e, '#stream')} data-lang="nav-stream">
            {t('nav-stream')}
          </a>
          <a href="#contact" onClick={(e) => handleNavClick(e, '#contact')} data-lang="nav-contact">
            {t('nav-contact')}
          </a>
        </div>
        <div className="nav-actions">
          <button
            id="theme-btn"
            className="control-btn"
            onClick={toggleTheme}
            aria-label="Toggle Theme"
          >
            <i className="fa-solid fa-moon"></i>
            <i className="fa-solid fa-sun"></i>
          </button>
          <button
            id="lang-btn"
            className="control-btn"
            onClick={toggleLanguage}
            aria-label="Change Language"
          >
            {language.toUpperCase()}
          </button>
          <button
            id="hamburger-btn"
            className={`hamburger-btn ${isMobileMenuOpen ? 'is-active' : ''}`}
            onClick={isMobileMenuOpen ? closeMobileMenu : openMobileMenu}
            aria-label="Toggle Menu"
            aria-expanded={isMobileMenuOpen ? 'true' : 'false'}
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
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
            <a href="#services" onClick={(e) => handleNavClick(e, '#services')} data-lang="nav-skills">
              {t('nav-skills')}
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
            <Link to="/sistem" onClick={closeMobileMenu} data-lang="sistem-hero-badge">
              {t('sistem-hero-badge')}
            </Link>
            <a href="#stream" onClick={(e) => handleNavClick(e, '#stream')} data-lang="nav-stream">
              {t('nav-stream')}
            </a>
            <a href="#contact" onClick={(e) => handleNavClick(e, '#contact')} data-lang="nav-contact">
              {t('nav-contact')}
            </a>
          </div>
        </div>
      </div>

      {/* ═══════════════ MAIN CONTENT WRAPPER ═══════════════ */}
      <main className="site-wrapper">
        {children}

        {/* FOOTER */}
        <footer className="site-footer">
          <div>
            <p className="footer-quote" data-lang="footer-quote">
              {t('footer-quote')}
            </p>
            <p className="footer-copyright">
              © <span id="year">{currentYear}</span> Mustafa Kemal ·{' '}
              <span data-lang="footer-rights">{t('footer-rights')}</span>
            </p>
          </div>
          <nav className="footer-links" aria-label="Footer links">
            <a href="https://github.com/mustafakemalz" target="_blank" rel="noopener noreferrer">
              GITHUB
            </a>
            <a href="https://www.youtube.com/@mustafakemalz" target="_blank" rel="noopener noreferrer">
              YOUTUBE
            </a>
            <a
              href="https://tr.linkedin.com/in/mustafa-kemal-g%C3%B6%C3%A7er-41409b255"
              target="_blank"
              rel="noopener noreferrer"
            >
              LINKEDIN
            </a>
          </nav>
        </footer>
      </main>

      {/* ═══════════════ DISCORD WIDGET (Bottom-right) ═══════════════ */}
      <DiscordWidget />
    </>
  );
};
export default Layout;
