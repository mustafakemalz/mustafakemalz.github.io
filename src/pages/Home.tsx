import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from '../context/LanguageContext';
import { useDiscordStatus } from '../hooks/useDiscordStatus';
import StatCard from '../components/StatCard';
import ProjectCard from '../components/ProjectCard';
import SpotifyWidget from '../components/SpotifyWidget';
import GithubWidget from '../components/GithubWidget';

export const Home: React.FC = () => {
  const { t, language } = useTranslation();
  const discordStatus = useDiscordStatus();
  const location = useLocation();

  // Scroll Parallax refs
  const heroHeaderRef = useRef<HTMLDivElement>(null);
  const heroWrapRef = useRef<HTMLDivElement>(null);

  // Form State
  const [formStatus, setFormStatus] = useState<string>('');
  const [formStatusColor, setFormStatusColor] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Scroll to section passed from route navigation (e.g. from Journey page)
  useEffect(() => {
    if (location.state && (location.state as any).scrollTo) {
      const targetId = (location.state as any).scrollTo;
      // Clear location state to prevent repeat scrolling on refresh
      window.history.replaceState({}, document.title);

      const timer = setTimeout(() => {
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
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [location]);

  // Parallax Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroWrap = heroWrapRef.current;
      const heroHeader = heroHeaderRef.current;

      if (heroWrap) {
        if (scrollY < window.innerHeight) {
          const progress = scrollY / window.innerHeight;
          heroWrap.style.transform = `translate3d(0, ${scrollY * 0.18}px, 0)`;
          if (heroHeader) {
            heroHeader.style.opacity = String(Math.max(0.3, 1 - progress * 0.7));
          }
        } else {
          heroWrap.style.transform = `translate3d(0, ${window.innerHeight * 0.18}px, 0)`;
          if (heroHeader) {
            heroHeader.style.opacity = '0.3';
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Form Submission
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus('');

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: data,
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        setFormStatus(t('form-success'));
        setFormStatusColor('var(--status-online)');
        form.reset();
      } else {
        throw new Error();
      }
    } catch {
      setFormStatus(t('form-error'));
      setFormStatusColor('#ef4444');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
    fallbackUrl: string
  ) => {
    e.currentTarget.src = fallbackUrl;
  };

  // Last Updated Date generator
  const lastUpdatedText = () => {
    const now = new Date();
    const monthsEn = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthsTr = [
      'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
      'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];
    const months = language === 'tr' ? monthsTr : monthsEn;
    const prefix = t('last-updated-prefix');
    return `${prefix} ${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
  };

  // Discord dot color representation
  const getDiscordDotColor = () => {
    if (!discordStatus) return 'var(--status-offline)';
    const colors = {
      online: 'var(--status-online)',
      idle: 'var(--status-idle)',
      dnd: 'var(--status-dnd)',
      offline: 'var(--status-offline)',
    };
    return colors[discordStatus.status] || colors.offline;
  };

  return (
    <>
      {/* HEADER / HERO */}
      <header className="site-header reveal" ref={heroHeaderRef}>
        <div className="hero-parallax-wrap" ref={heroWrapRef}>
          <div className="header-avatar">
            <img
              src="assets/profile.png"
              alt="Mustafa Kemal Göçer"
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
          </div>
          <div className="header-info">
            <h1 data-lang="hero-greeting">{t('hero-greeting')}</h1>
            <p className="header-subtitle" data-lang="hero-title">
              {t('hero-title')}
            </p>
            <p className="hero-slogan" data-lang="hero-slogan">
              {t('hero-slogan')}
            </p>
            <div className="status-indicator">
              <div
                id="hero-discord-dot"
                className="status-dot"
                style={{ background: getDiscordDotColor() }}
              ></div>
              <span id="hero-discord-text" data-lang="status-text">
                {t('status-text')}
              </span>
            </div>
            <nav aria-label="Social media links" className="social-nav">
              <a
                href="https://github.com/mustafakemalz"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a
                href="https://www.youtube.com/@mustafakemalz"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                  <path d="m10 15 5-3-5-3z" />
                </svg>
              </a>
              <a
                href="https://tr.linkedin.com/in/mustafa-kemal-g%C3%B6%C3%A7er-41409b255"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/jpeg.muskz"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a href="mailto:contact@mustafakemalz.github.io" aria-label="Send email">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* TL;DR CARD */}
      <section className="tldr-card reveal" aria-labelledby="tldr-heading">
        <h2 id="tldr-heading" className="hidden">Quick Summary</h2>
        <p>
          <strong>TL;DR:</strong>{' '}
          <span data-lang="tldr-text">{t('tldr-text')}</span>
        </p>
      </section>

      {/* Last Updated */}
      <div className="last-updated">
        <time id="last-updated-time">{lastUpdatedText()}</time>
      </div>

      <hr className="section-divider" />

      {/* ABOUT ME */}
      <section id="about" className="section reveal" aria-labelledby="about-heading">
        <h2 id="about-heading" className="section-title" data-lang="about-title">
          {t('about-title')}
        </h2>
        <p className="section-text" data-lang="about-text">
          {t('about-text')}
        </p>
        <div className="stats-grid reveal-stagger">
          <StatCard count={4} suffix="+" label={t('stat-years')} />
          <StatCard count={5} suffix="+" label={t('stat-projects')} />
          <StatCard count={12} suffix="+" label={t('stat-tech')} />
        </div>
        <div className="badge-row">
          <span className="badge" data-lang="badge-1">
            {t('badge-1')}
          </span>
          <span className="badge" data-lang="badge-2">
            {t('badge-2')}
          </span>
          <span className="badge" data-lang="badge-3">
            {t('badge-3')}
          </span>
        </div>
        <div className="skills-block">
          <div className="skill-category">
            <h3 data-lang="skill-cat-1">{t('skill-cat-1')}</h3>
            <div className="skill-pills">
              <span className="skill-pill">
                <i className="fa-solid fa-microchip"></i> STM32
              </span>
              <span className="skill-pill">
                <i className="fa-solid fa-microchip"></i> Arduino
              </span>
              <span className="skill-pill">
                <i className="fa-solid fa-microchip"></i> ESP32
              </span>
              <span className="skill-pill">
                <i className="fa-solid fa-layer-group"></i> Altium Designer
              </span>
              <span className="skill-pill">
                <i className="fa-solid fa-wifi"></i> IoT
              </span>
              <span className="skill-pill">
                <i className="fa-solid fa-bolt"></i> Power Systems
              </span>
            </div>
          </div>
          <div className="skill-category">
            <h3 data-lang="skill-cat-2">{t('skill-cat-2')}</h3>
            <div className="skill-pills">
              <span className="skill-pill">
                <i className="fa-brands fa-react"></i> React
              </span>
              <span className="skill-pill">
                <i className="fa-solid fa-code"></i> Next.js
              </span>
              <span className="skill-pill">
                <i className="fa-brands fa-node-js"></i> Node.js
              </span>
              <span className="skill-pill">
                <i className="fa-solid fa-code"></i> TypeScript
              </span>
              <span className="skill-pill">
                <i className="fa-brands fa-github"></i> Open Source
              </span>
            </div>
          </div>
        </div>
        <div className="expertise-block" aria-hidden="true">
          <h3 data-lang="expertise-title">{t('expertise-title')}</h3>
          <ul className="expertise-list">
            <li data-lang="exp-1">{t('exp-1')}</li>
            <li data-lang="exp-2">{t('exp-2')}</li>
            <li data-lang="exp-3">{t('exp-3')}</li>
            <li data-lang="exp-4">{t('exp-4')}</li>
            <li data-lang="exp-5">{t('exp-5')}</li>
          </ul>
        </div>
      </section>

      <hr className="section-divider" />

      {/* WHAT I DO (Service Cards) */}
      <section id="services" className="section section-alt reveal" aria-labelledby="services-heading">
        <h2 id="services-heading" className="section-title" data-lang="services-title">
          {t('services-title')}
        </h2>
        <p className="section-text" data-lang="services-text">
          {t('services-text')}
        </p>
        <div className="services-grid reveal-stagger">
          <div className="service-card">
            <div className="service-icon">
              <i className="fa-solid fa-microchip"></i>
            </div>
            <span data-lang="svc-1">{t('svc-1')}</span>
          </div>
          <div className="service-card">
            <div className="service-icon">
              <i className="fa-solid fa-wifi"></i>
            </div>
            <span data-lang="svc-2">{t('svc-2')}</span>
          </div>
          <div className="service-card">
            <div className="service-icon">
              <i className="fa-solid fa-layer-group"></i>
            </div>
            <span data-lang="svc-3">{t('svc-3')}</span>
          </div>
          <div className="service-card">
            <div className="service-icon">
              <i className="fa-solid fa-code"></i>
            </div>
            <span data-lang="svc-4">{t('svc-4')}</span>
          </div>
          <div className="service-card">
            <div className="service-icon">
              <i className="fa-solid fa-video"></i>
            </div>
            <span data-lang="svc-5">{t('svc-5')}</span>
          </div>
          <div className="service-card">
            <div className="service-icon">
              <i className="fa-brands fa-github"></i>
            </div>
            <span data-lang="svc-6">{t('svc-6')}</span>
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      {/* EXPERIENCE & EDUCATION */}
      <section id="experience" className="section reveal" aria-labelledby="experience-heading">
        <h2 id="experience-heading" className="section-title" data-lang="exp-title">
          {t('exp-title')}
        </h2>
        <div className="experience-list">
          <div className="experience-item">
            <div className="exp-header">
              <span className="exp-company">ÇUKUROVA UNIVERSITY</span>
              <span className="exp-date">2022 - 2026</span>
            </div>
            <div className="exp-role" data-lang="edu-1-role">
              {t('edu-1-role')}
            </div>
            <p className="exp-desc" data-lang="edu-1-desc">
              {t('edu-1-desc')}
            </p>
          </div>
          <div className="experience-item">
            <div className="exp-header">
              <span className="exp-company">ISKAR TECHNOLOGIES</span>
              <span className="exp-date">2025</span>
            </div>
            <div className="exp-role" data-lang="edu-2-role">
              {t('edu-2-role')}
            </div>
            <p className="exp-desc" data-lang="edu-2-desc">
              {t('edu-2-desc')}
            </p>
            <div className="exp-techs">
              <span>ALTIUM</span>
              <span>PCB</span>
              <span>PROTOTYPING</span>
            </div>
          </div>
          <div className="experience-item">
            <div className="exp-header">
              <span className="exp-company">STATU.CO</span>
              <span className="exp-date">2024</span>
            </div>
            <div className="exp-role" data-lang="edu-3-role">
              {t('edu-3-role')}
            </div>
            <p className="exp-desc" data-lang="edu-3-desc">
              {t('edu-3-desc')}
            </p>
            <div className="exp-techs">
              <span>REACT</span>
              <span>TYPESCRIPT</span>
              <span>WEB3</span>
            </div>
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      {/* FEATURED PROJECTS */}
      <section id="projects" className="section section-alt reveal" aria-labelledby="projects-heading">
        <h2 id="projects-heading" className="section-title" data-lang="proj-title">
          {t('proj-title')}
        </h2>
        <p className="section-text" data-lang="proj-text">
          {t('proj-text')}
        </p>
        <div className="projects-list">
          <ProjectCard
            title="Streamdoro"
            tags="Next.js · OBS · WebSocket"
            description="Pomodoro timer built for Study With Me streamers. Real-time OBS overlay, 3 themes, 6 languages."
            link="https://streamdoro.app"
            visualClass="project-visual--streamdoro"
          />
          <ProjectCard
            title="ShareRoute"
            tags="React Native · Expo · TypeScript · Supabase"
            description="Mobile route planning and sharing app. Currently in development."
            comingSoon={true}
          />
          <ProjectCard
            title="Fragstat"
            tags="React · API · Overlay"
            description="Add Faceit ranks as an OBS overlay and track player statistics."
            link="https://faceitoverlay.vercel.app"
            visualClass="project-visual--faceitoverlay"
          />
        </div>
      </section>

      {/* LATEST STREAM */}
      <section id="stream" className="section reveal" aria-labelledby="stream-heading">
        <h2 id="stream-heading" className="section-title" data-lang="yt-title">
          {t('yt-title')}
        </h2>

        <div className="stream-showcase">
          {/* Video Column */}
          <div className="stream-video-col">
            <div className="video-embed">
              <iframe
                src="https://www.youtube.com/embed/y2X01DtZ6B0?rel=0&modestbranding=1"
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          </div>

          {/* Info Column */}
          <div className="stream-info-col">
            <div className="stream-channel-card">
              <div className="channel-card-header">
                <div className="channel-avatar">
                  <img
                    src="assets/profile.png"
                    alt="Mustafa Kemal Göçer"
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                </div>
                <div className="channel-meta">
                  <span className="channel-name">Mustafa Kemal</span>
                  <span className="channel-handle">@mustafakemalz</span>
                </div>
              </div>
              <p className="channel-desc" data-lang="yt-desc-text">
                {t('yt-desc-text')}
              </p>

              <ul className="channel-features">
                <li>
                  <i
                    className="fa-solid fa-circle"
                    style={{
                      color: '#ff0000',
                      fontSize: '8px',
                      verticalAlign: 'middle',
                      marginRight: '8px',
                    }}
                  ></i>{' '}
                  <span data-lang="yt-info-1">{t('yt-info-1')}</span>
                </li>
                <li>
                  <i
                    className="fa-solid fa-wrench"
                    style={{ color: 'var(--accent)', marginRight: '8px' }}
                  ></i>{' '}
                  <span data-lang="yt-info-2">{t('yt-info-2')}</span>
                </li>
                <li>
                  <i
                    className="fa-solid fa-comments"
                    style={{ color: 'var(--status-online)', marginRight: '8px' }}
                  ></i>{' '}
                  <span data-lang="yt-info-3">{t('yt-info-3')}</span>
                </li>
              </ul>

              <a
                href="https://www.youtube.com/@mustafakemalz"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ marginTop: '0.5rem' }}
                data-lang="yt-btn"
              >
                <span>{t('yt-btn')}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      {/* SPOTIFY & GITHUB WIDGETS */}
      <section className="section reveal" aria-labelledby="widgets-heading">
        <h2 id="widgets-heading" className="section-title" data-lang="spotify-title">
          {t('spotify-title')}
        </h2>
        <div className="widgets-row">
          {/* Spotify Box */}
          <div className="widget-box">
            <div className="widget-header">
              <div className="widget-brand">
                <i className="fa-brands fa-spotify"></i>
                <span data-lang="spotify-source">{t('spotify-source')}</span>
              </div>
            </div>
            <SpotifyWidget />
          </div>

          {/* GitHub Box */}
          <div className="widget-box">
            <div className="widget-header">
              <div className="widget-brand">
                <i className="fa-brands fa-github"></i>
                <span data-lang="github-title">{t('github-title')}</span>
              </div>
              <a
                href="https://github.com/mustafakemalz"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View GitHub profile"
              >
                <i className="fa-solid fa-arrow-up-right-from-square"></i>
              </a>
            </div>
            <GithubWidget />
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      {/* GALLERY (Life Style) */}
      <section className="section reveal" aria-labelledby="gallery-heading">
        <h2 id="gallery-heading" className="section-title" data-lang="gallery-title">
          {t('gallery-title')}
        </h2>
        <div className="gallery-grid reveal-stagger">
          <div className="gallery-item">
            <img
              src="assets/photo1.jpg"
              alt="Engineering Lab"
              onError={(e) =>
                handleImageError(
                  e,
                  'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop'
                )
              }
            />
            <span className="gallery-caption" data-lang="gallery-1">
              {t('gallery-1')}
            </span>
          </div>
          <div className="gallery-item">
            <img
              src="assets/photo2.jpg"
              alt="Simulation"
              onError={(e) =>
                handleImageError(
                  e,
                  'https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=600&auto=format&fit=crop'
                )
              }
            />
            <span className="gallery-caption" data-lang="gallery-2">
              {t('gallery-2')}
            </span>
          </div>
          <div className="gallery-item">
            <img
              src="assets/photo3.gif"
              alt="Hardware"
              onError={(e) =>
                handleImageError(
                  e,
                  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop'
                )
              }
            />
            <span className="gallery-caption" data-lang="gallery-3">
              {t('gallery-3')}
            </span>
          </div>
          <div className="gallery-item">
            <img
              src="assets/photo4.jpg"
              alt="Field Work"
              onError={(e) =>
                handleImageError(
                  e,
                  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600&auto=format&fit=crop'
                )
              }
            />
            <span className="gallery-caption" data-lang="gallery-4">
              {t('gallery-4')}
            </span>
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      {/* CONTACT */}
      <section id="contact" className="section section-alt reveal" aria-labelledby="contact-heading">
        <div className="cta-row">
          <h2
            id="contact-heading"
            className="cta-title"
            data-lang="contact-cta"
            dangerouslySetInnerHTML={{ __html: t('contact-cta') }}
          ></h2>
          <a
            href="#contact-form-area"
            className="btn-primary"
            onClick={(e) => {
              e.preventDefault();
              const target = document.querySelector('#contact-form-area');
              if (target) {
                if ((window as any).lenis) {
                  (window as any).lenis.scrollTo(target, { offset: -72 });
                } else {
                  target.scrollIntoView({ behavior: 'smooth' });
                }
              }
            }}
            data-lang="form-btn"
          >
            <span>{t('form-btn')}</span>
          </a>
        </div>

        {/* Contact Form */}
        <div id="contact-form-area">
          <form
            id="contact-form"
            className="contact-form"
            action="https://formspree.io/f/xeeozdyd"
            method="POST"
            autoComplete="off"
            onSubmit={handleFormSubmit}
          >
            <div className="form-group">
              <label htmlFor="name" data-lang="form-name">
                {t('form-name')}
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                placeholder=" "
                autoComplete="off"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email" data-lang="form-email">
                {t('form-email')}
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                placeholder=" "
                autoComplete="off"
              />
            </div>
            <div className="form-group">
              <label htmlFor="message" data-lang="form-msg">
                {t('form-msg')}
              </label>
              <textarea
                name="message"
                id="message"
                required
                placeholder=" "
                autoComplete="off"
              ></textarea>
            </div>
            <button type="submit" className="btn-primary-full" id="form-btn" disabled={isSubmitting}>
              <i className="fa-solid fa-paper-plane"></i>
              <span data-lang="form-btn">
                {isSubmitting ? 'SENDING...' : t('form-btn')}
              </span>
            </button>
            {formStatus && (
              <p id="form-status" style={{ color: formStatusColor, marginTop: '1rem', fontWeight: 500 }}>
                {formStatus}
              </p>
            )}
          </form>
        </div>

        {/* Social Links */}
        <div className="btn-row">
          <a
            href="https://github.com/mustafakemalz"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline btn-github"
          >
            <i className="fa-brands fa-github"></i>
            <span>GitHub</span>
          </a>
          <a
            href="https://tr.linkedin.com/in/mustafa-kemal-g%C3%B6%C3%A7er-41409b255"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline btn-linkedin"
          >
            <i className="fa-brands fa-linkedin-in"></i>
            <span>LinkedIn</span>
          </a>
        </div>
        <div className="btn-row">
          <a
            href="https://www.youtube.com/@mustafakemalz"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline btn-youtube"
          >
            <i className="fa-brands fa-youtube"></i>
            <span>YouTube</span>
          </a>
          <a
            href="https://www.instagram.com/jpeg.muskz"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline btn-instagram"
          >
            <i className="fa-brands fa-instagram"></i>
            <span>Instagram</span>
          </a>
        </div>

        <div className="status-indicator">
          <div className="status-dot"></div>
          <p data-lang="status-text">{t('status-text')}</p>
        </div>
      </section>
    </>
  );
};
export default Home;
