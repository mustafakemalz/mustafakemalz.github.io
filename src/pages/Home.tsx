import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from '../context/LanguageContext';
import ProjectCard from '../components/ProjectCard';
import AsciiHeroCanvas from '../components/AsciiHeroCanvas';
import Icon from '../components/Icon';

interface TechItem {
  name: string;
  icon: string;
  color: string;
}

const TECH_ROWS: TechItem[][] = [
  [
    { name: 'TypeScript', icon: 'typescript', color: '#3178C6' },
    { name: 'JavaScript', icon: 'javascript', color: '#F7DF1E' },
    { name: 'Python', icon: 'python', color: '#3776AB' },
    { name: 'C / C++', icon: 'cpp', color: '#00599C' },
    { name: 'USB HID', icon: 'usb', color: '#38BDF8' },
  ],
  [
    { name: 'React', icon: 'react', color: '#61DAFB' },
    { name: 'Next.js', icon: 'nextjs', color: 'var(--foreground-heading)' },
    { name: 'Electron', icon: 'electron', color: '#47848F' },
    { name: 'Node.js', icon: 'node-js', color: '#5FA04E' },
    { name: 'Tailwind CSS', icon: 'tailwind', color: '#06B6D4' },
  ],
  [
    { name: 'STM32', icon: 'microchip', color: '#00A9E0' },
    { name: 'ESP32', icon: 'wifi', color: '#E7352C' },
    { name: 'Raspberry Pi', icon: 'raspberry-pi', color: '#C51A4A' },
    { name: 'Altium Designer', icon: 'layer-group', color: '#A5915F' },
    { name: 'SolidWorks', icon: 'cube', color: '#DA291C' },
  ],
  [
    { name: 'Ollama', icon: 'terminal', color: 'var(--foreground-heading)' },
    { name: 'Docker', icon: 'docker', color: '#2496ED' },
    { name: 'Git', icon: 'git', color: '#F05032' },
    { name: 'Linux', icon: 'linux', color: '#FCC624' },
    { name: 'Supabase', icon: 'supabase', color: '#3ECF8E' },
  ],
];

export const Home: React.FC = () => {
  const { t, language } = useTranslation();
  const location = useLocation();

  const heroHeaderRef = useRef<HTMLDivElement>(null);

  const [formStatus, setFormStatus] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (location.state && (location.state as any).scrollTo) {
      const targetId = (location.state as any).scrollTo;
      window.history.replaceState({}, document.title);

      const timer = setTimeout(() => {
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
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [location]);

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
        form.reset();
      } else {
        throw new Error();
      }
    } catch {
      setFormStatus(t('form-error'));
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

  return (
    <>
      <AsciiHeroCanvas />
      {/* HERO */}
      <header className="site-header reveal" ref={heroHeaderRef}>
        <div className="hero-parallax-wrap">
          <div className="hero-grid">
            <div className="hero-avatar-col">
              <div className="hero-avatar-frame" title="MKG // Hardware & Embedded Architecture">
                <div className="hero-chip-badge" aria-label="MKG Hardware Architecture Emblem">
                  <svg
                    viewBox="0 0 88 88"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="hero-chip-svg"
                    aria-hidden="true"
                  >
                    {/* Background Substrate Pin Leads */}
                    <path
                      d="M10 26H22M10 44H22M10 62H22M66 26H78M66 44H78M66 62H78M26 10V22M44 10V22M62 10V22M26 66V78M44 66V78M62 66V78"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      className="hero-chip-pins"
                    />
                    {/* IC Carrier Package */}
                    <rect
                      x="22"
                      y="22"
                      width="44"
                      height="44"
                      rx="6"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="hero-chip-body"
                    />
                    {/* Pin 1 Index Dot */}
                    <circle cx="28.5" cy="28.5" r="2" fill="#10b981" className="hero-chip-pin1" />
                    {/* Silicon Core Die Boundary */}
                    <rect
                      x="30"
                      y="30"
                      width="28"
                      height="28"
                      rx="3"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeDasharray="2 2"
                      className="hero-chip-die"
                    />
                    {/* Internal Bus & Logic Routing Traces */}
                    <path
                      d="M37 37L44 44M51 37L44 44M44 44V51"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      className="hero-chip-trace"
                    />
                    {/* Laser Engraved Monogram & Clock */}
                    <text
                      x="44"
                      y="42"
                      textAnchor="middle"
                      className="hero-chip-label"
                      fill="currentColor"
                    >
                      MKG
                    </text>
                    <text
                      x="44"
                      y="52"
                      textAnchor="middle"
                      className="hero-chip-sub"
                      fill="currentColor"
                    >
                      84MHz
                    </text>
                  </svg>
                </div>
                <span className="hero-avatar-status" title={t('hero-status')} aria-label={t('hero-status')}>
                  <span className="hero-avatar-dot" />
                </span>
              </div>
              <div className="hero-avatar-meta">
                <span className="hero-meta-label">MKG // 2026</span>
                <span className="hero-meta-sub">Adana, TR</span>
                <span className="hero-meta-status">{t('hero-status')}</span>
              </div>
            </div>

            <div className="header-info">
              <h1 className="hero-name" data-lang="hero-name">
                {t('hero-name')}
              </h1>
              <p className="hero-role" data-lang="hero-role">
                {t('hero-role')}
              </p>
              <p className="hero-lead" data-lang="hero-lead">
                {t('hero-lead')}
              </p>
              <nav aria-label="External links" className="hero-text-links">
                <a
                  href="https://github.com/mustafakemalz"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub ↗
                </a>
                <a
                  href="https://tr.linkedin.com/in/mustafa-kemal-g%C3%B6%C3%A7er-41409b255"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn ↗
                </a>
                <a
                  href="https://www.instagram.com/jpeg.muskz/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram ↗
                </a>
                <a href="mailto:mustafakemalgocer@gmail.com">
                  mustafakemalgocer@gmail.com ↗
                </a>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* TECH STACK ROWS (Hover-colored brand icons, hairline rows) */}
      <section id="about" className="section reveal" aria-labelledby="about-heading">
        <div className="section-head">
          <h2 id="about-heading" className="section-title" data-lang="about-title">
            {t('about-title')}
          </h2>
        </div>
        <div className="tech-ledger">
          {TECH_ROWS.map((row, rowIndex) => (
            <div className="tech-row" key={rowIndex}>
              {row.map((item) => (
                <div
                  key={item.name}
                  className="tech-item"
                  style={{ '--brand-color': item.color } as React.CSSProperties}
                >
                  <Icon name={item.icon} className="tech-item-icon" size={20} />
                  <span className="tech-item-name">{item.name}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* EXPERIENCE & EDUCATION */}
      <section id="experience" className="section reveal" aria-labelledby="experience-heading">
        <div className="section-head">
          <h2 id="experience-heading" className="section-title" data-lang="exp-title">
            {t('exp-title')}
          </h2>
        </div>
        <div className="exp-ledger">
          <article className="exp-row">
            <div className="exp-row-meta">
              <span className="exp-date">
                {language === 'tr' ? '2026 — Günümüz' : '2026 — Present'}
              </span>
              <a
                href="https://elmantech.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="exp-company-link"
              >
                Elman Otomasyon ↗
              </a>
            </div>
            <div className="exp-row-main">
              <h3 className="exp-role" data-lang="exp-0-role">
                {t('exp-0-role')}
              </h3>
              <p className="exp-desc" data-lang="exp-0-desc">
                {t('exp-0-desc')}
              </p>
            </div>
          </article>

          <article className="exp-row">
            <div className="exp-row-meta">
              <span className="exp-date">2022 — 2026</span>
              <span className="exp-company">Çukurova University</span>
            </div>
            <div className="exp-row-main">
              <h3 className="exp-role" data-lang="edu-1-role">
                {t('edu-1-role')}
              </h3>
              <p className="exp-desc" data-lang="edu-1-desc">
                {t('edu-1-desc')}
              </p>
            </div>
          </article>

          <article className="exp-row">
            <div className="exp-row-meta">
              <span className="exp-date">2025</span>
              <span className="exp-company">Iskar Technologies</span>
            </div>
            <div className="exp-row-main">
              <h3 className="exp-role" data-lang="edu-2-role">
                {t('edu-2-role')}
              </h3>
              <p className="exp-desc" data-lang="edu-2-desc">
                {t('edu-2-desc')}
              </p>
            </div>
          </article>

          <article className="exp-row">
            <div className="exp-row-meta">
              <span className="exp-date">2024</span>
              <span className="exp-company">Statu.co</span>
            </div>
            <div className="exp-row-main">
              <h3 className="exp-role" data-lang="edu-3-role">
                {t('edu-3-role')}
              </h3>
              <p className="exp-desc" data-lang="edu-3-desc">
                {t('edu-3-desc')}
              </p>
            </div>
          </article>
        </div>
      </section>

      {/* SELECTED WORK */}
      <section id="projects" className="section reveal" aria-labelledby="projects-heading">
        <div className="section-head">
          <h2 id="projects-heading" className="section-title" data-lang="proj-title">
            {t('proj-title')}
          </h2>
        </div>

        <div className="projects-ledger">
          <ProjectCard
            year="2026"
            title="OpenController"
            tags="Electron · TypeScript · USB HID"
            description={t('proj-opencontroller-desc')}
            link="https://github.com/mustafakemalz/opencontroller"
            linkText="GitHub ↗"
          />
          <ProjectCard
            year="2025"
            title="Streamdoro"
            tags="Next.js · OBS · WebSocket"
            description={t('proj-streamdoro-desc')}
            link="https://streamdoro.app"
            linkText="streamdoro.app ↗"
          />
          <ProjectCard
            year="2025"
            title="Fragstat"
            tags="React · FACEIT API · OBS"
            description={t('proj-fragstat-desc')}
            link="https://faceitoverlay.vercel.app"
            linkText="faceitoverlay.vercel.app ↗"
          />
          <ProjectCard
            year="2025"
            title="ShareRoute"
            tags="React Native · Expo · Supabase"
            description={t('proj-shareroute-desc')}
            comingSoon={true}
          />
        </div>
      </section>

      {/* LAB & FIELD NOTES (Gallery) */}
      <section id="gallery" className="section reveal" aria-labelledby="gallery-heading">
        <div className="section-head">
          <h2 id="gallery-heading" className="section-title" data-lang="gallery-title">
            {t('gallery-title')}
          </h2>
        </div>
        <div className="gallery-grid reveal-stagger">
          <figure className="gallery-figure">
            <div className="gallery-img-wrap">
              <img
                src="/assets/photo1.webp"
                alt="Engineering Lab"
                loading="lazy"
                decoding="async"
                onError={(e) =>
                  handleImageError(
                    e,
                    'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop'
                  )
                }
              />
            </div>
            <figcaption className="gallery-caption" data-lang="gallery-1">
              {t('gallery-1')}
            </figcaption>
          </figure>
          <figure className="gallery-figure">
            <div className="gallery-img-wrap">
              <img
                src="/assets/photo2.webp"
                alt="Simulation"
                loading="lazy"
                decoding="async"
                onError={(e) =>
                  handleImageError(
                    e,
                    'https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=600&auto=format&fit=crop'
                  )
                }
              />
            </div>
            <figcaption className="gallery-caption" data-lang="gallery-2">
              {t('gallery-2')}
            </figcaption>
          </figure>
          <figure className="gallery-figure">
            <div className="gallery-img-wrap">
              <img
                src="/assets/photo3.gif"
                alt="Hardware"
                loading="lazy"
                decoding="async"
                onError={(e) =>
                  handleImageError(
                    e,
                    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop'
                  )
                }
              />
            </div>
            <figcaption className="gallery-caption" data-lang="gallery-3">
              {t('gallery-3')}
            </figcaption>
          </figure>
          <figure className="gallery-figure">
            <div className="gallery-img-wrap">
              <img
                src="/assets/photo4.webp"
                alt="Field Work"
                loading="lazy"
                decoding="async"
                onError={(e) =>
                  handleImageError(
                    e,
                    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600&auto=format&fit=crop'
                  )
                }
              />
            </div>
            <figcaption className="gallery-caption" data-lang="gallery-4">
              {t('gallery-4')}
            </figcaption>
          </figure>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="section reveal" aria-labelledby="contact-heading">
        <div className="contact-split">
          <div className="contact-meta">
            <h2 id="contact-heading" className="section-title" data-lang="contact-cta">
              {t('contact-cta')}
            </h2>
            <p className="contact-lead" data-lang="contact-lead">
              {t('contact-lead')}
            </p>
            <div className="contact-links-list">
              <a href="mailto:mustafakemalgocer@gmail.com">
                mustafakemalgocer@gmail.com ↗
              </a>
              <a
                href="https://github.com/mustafakemalz"
                target="_blank"
                rel="noopener noreferrer"
              >
                github.com/mustafakemalz ↗
              </a>
              <a
                href="https://tr.linkedin.com/in/mustafa-kemal-g%C3%B6%C3%A7er-41409b255"
                target="_blank"
                rel="noopener noreferrer"
              >
                linkedin.com/in/mustafa-kemal-göçer ↗
              </a>
              <a
                href="https://www.instagram.com/jpeg.muskz/"
                target="_blank"
                rel="noopener noreferrer"
              >
                instagram.com/jpeg.muskz ↗
              </a>
            </div>
          </div>

          <div id="contact-form-area" className="contact-form-col">
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
                  autoComplete="off"
                ></textarea>
              </div>
              <div className="form-actions">
                <button type="submit" className="form-submit-link" id="form-btn" disabled={isSubmitting}>
                  <span data-lang="form-btn">
                    {isSubmitting ? '...' : t('form-btn')}
                  </span>
                </button>
                {formStatus && (
                  <span id="form-status" className="form-status-msg">
                    {formStatus}
                  </span>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};
export default Home;
