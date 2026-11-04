import React, { useEffect, useState } from 'react';
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

interface TechRow {
  labelKey: string;
  items: TechItem[];
}

const TECH_ROWS: TechRow[] = [
  {
    labelKey: 'stack-cat-lang',
    items: [
      { name: 'TypeScript', icon: 'typescript', color: '#3178C6' },
      { name: 'JavaScript', icon: 'javascript', color: '#F7DF1E' },
      { name: 'Python', icon: 'python', color: '#3776AB' },
      { name: 'C / C++', icon: 'cpp', color: '#00599C' },
      { name: 'USB HID', icon: 'usb', color: '#38BDF8' },
    ],
  },
  {
    labelKey: 'stack-cat-web',
    items: [
      { name: 'React', icon: 'react', color: '#61DAFB' },
      { name: 'Next.js', icon: 'nextjs', color: 'var(--foreground-heading)' },
      { name: 'Electron', icon: 'electron', color: '#47848F' },
      { name: 'Node.js', icon: 'node-js', color: '#5FA04E' },
      { name: 'Tailwind CSS', icon: 'tailwind', color: '#06B6D4' },
    ],
  },
  {
    labelKey: 'stack-cat-hw',
    items: [
      { name: 'STM32', icon: 'microchip', color: '#00A9E0' },
      { name: 'ESP32', icon: 'wifi', color: '#E7352C' },
      { name: 'Raspberry Pi', icon: 'raspberry-pi', color: '#C51A4A' },
      { name: 'Altium Designer', icon: 'layer-group', color: '#A5915F' },
      { name: 'SolidWorks', icon: 'cube', color: '#DA291C' },
    ],
  },
  {
    labelKey: 'stack-cat-tools',
    items: [
      { name: 'Ollama', icon: 'terminal', color: 'var(--foreground-heading)' },
      { name: 'Docker', icon: 'docker', color: '#2496ED' },
      { name: 'Git', icon: 'git', color: '#F05032' },
      { name: 'Linux', icon: 'linux', color: '#FCC624' },
      { name: 'Supabase', icon: 'supabase', color: '#3ECF8E' },
    ],
  },
];

interface ExperienceItem {
  date: { en: string; tr: string };
  org: string;
  orgUrl?: string;
  roleKey: string;
  descKey: string;
}

const EXPERIENCE: ExperienceItem[] = [
  {
    date: { en: '2026 — Present', tr: '2026 — Günümüz' },
    org: 'Elman Otomasyon',
    orgUrl: 'https://elmantech.com/',
    roleKey: 'exp-0-role',
    descKey: 'exp-0-desc',
  },
  {
    date: { en: '2022 — 2026', tr: '2022 — 2026' },
    org: 'Çukurova University',
    roleKey: 'edu-1-role',
    descKey: 'edu-1-desc',
  },
  {
    date: { en: '2025', tr: '2025' },
    org: 'Iskar Technologies',
    roleKey: 'edu-2-role',
    descKey: 'edu-2-desc',
  },
  {
    date: { en: '2024', tr: '2024' },
    org: 'Statu.co',
    roleKey: 'edu-3-role',
    descKey: 'edu-3-desc',
  },
];

const GALLERY = [
  { src: '/assets/photo1.webp', alt: 'Lab bench', captionKey: 'gallery-1' },
  { src: '/assets/photo2.webp', alt: 'PCB work', captionKey: 'gallery-2' },
  { src: '/assets/photo3.gif', alt: 'Controller test rig', captionKey: 'gallery-3' },
  { src: '/assets/photo4.webp', alt: 'Field work', captionKey: 'gallery-4' },
];

const CONTACT_LINKS = [
  { label: 'Email', handle: 'mustafakemalgocer@gmail.com', href: 'mailto:mustafakemalgocer@gmail.com' },
  { label: 'GitHub', handle: 'mustafakemalz', href: 'https://github.com/mustafakemalz' },
  {
    label: 'LinkedIn',
    handle: 'mustafa-kemal-göçer',
    href: 'https://tr.linkedin.com/in/mustafa-kemal-g%C3%B6%C3%A7er-41409b255',
  },
  { label: 'Instagram', handle: '@jpeg.muskz', href: 'https://www.instagram.com/jpeg.muskz/' },
];

const scrollToTarget = (targetId: string) => {
  const lenis = (window as any).lenis;
  if (targetId === '#' || targetId === '' || targetId === '#top') {
    if (lenis) lenis.scrollTo(0, { duration: 1.1 });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  const targetEl = document.querySelector(targetId);
  if (!targetEl) return;
  const navOffset = window.innerWidth <= 768 ? -64 : -72;
  if (lenis) {
    lenis.scrollTo(targetEl, { offset: navOffset, duration: 1.1 });
  } else {
    const targetY = targetEl.getBoundingClientRect().top + window.scrollY + navOffset;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  }
};

export const Home: React.FC = () => {
  const { t, language } = useTranslation();
  const location = useLocation();

  const [formStatus, setFormStatus] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const state = location.state as { scrollTo?: string } | null;
    if (!state?.scrollTo) return;
    const targetId = state.scrollTo;
    window.history.replaceState({}, document.title);
    const timer = window.setTimeout(() => scrollToTarget(targetId), 150);
    return () => window.clearTimeout(timer);
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

      if (!response.ok) throw new Error();
      setFormStatus(t('form-success'));
      form.reset();
    } catch {
      setFormStatus(t('form-error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <AsciiHeroCanvas />

      {/* HERO */}
      <header className="site-header">
        <div className="hero-parallax-wrap">
          <div className="hero-grid">
            <div className="hero-avatar-col">
              <div className="hero-avatar-frame" title="MKG">
                <div className="hero-chip-badge">
                  <svg
                    viewBox="0 0 88 88"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="hero-chip-svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M10 26H22M10 44H22M10 62H22M66 26H78M66 44H78M66 62H78M26 10V22M44 10V22M62 10V22M26 66V78M44 66V78M62 66V78"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      className="hero-chip-pins"
                    />
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
                    <circle cx="28.5" cy="28.5" r="2" fill="var(--live)" />
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
                    <text
                      x="44"
                      y="47.5"
                      textAnchor="middle"
                      className="hero-chip-label"
                      fill="currentColor"
                    >
                      MKG
                    </text>
                  </svg>
                </div>
                <span className="hero-avatar-status" title={t('hero-status')}>
                  <span className="hero-avatar-dot" />
                </span>
              </div>
              <div className="hero-avatar-meta">
                <span className="hero-meta-label">Adana, TR</span>
                <span className="hero-meta-status">{t('hero-status')}</span>
              </div>
            </div>

            <div className="header-info">
              <h1 className="hero-name">{t('hero-name')}</h1>
              <p className="hero-role">{t('hero-role')}</p>
              <p className="hero-lead">{t('hero-lead')}</p>
              <nav aria-label={t('aria-external-links')} className="hero-text-links">
                <a href="https://github.com/mustafakemalz" target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
                <a
                  href="https://tr.linkedin.com/in/mustafa-kemal-g%C3%B6%C3%A7er-41409b255"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
                <a href="https://www.instagram.com/jpeg.muskz/" target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
                <a href="mailto:mustafakemalgocer@gmail.com">mustafakemalgocer@gmail.com</a>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* STACK */}
      <section id="about" className="section reveal" aria-labelledby="about-heading">
        <div className="section-head">
          <h2 id="about-heading" className="section-title">
            {t('about-title')}
          </h2>
        </div>
        <div className="ledger">
          {TECH_ROWS.map((row) => (
            <div className="ledger-row tech-row" key={row.labelKey}>
              <span className="ledger-meta">{t(row.labelKey)}</span>
              <div className="tech-items">
                {row.items.map((item) => (
                  <div
                    key={item.name}
                    className="tech-item"
                    style={{ '--brand-color': item.color } as React.CSSProperties}
                  >
                    <Icon name={item.icon} className="tech-item-icon" size={18} />
                    <span className="tech-item-name">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* EXPERIENCE & EDUCATION */}
      <section id="experience" className="section reveal" aria-labelledby="experience-heading">
        <div className="section-head">
          <h2 id="experience-heading" className="section-title">
            {t('exp-title')}
          </h2>
        </div>
        <div className="ledger">
          {EXPERIENCE.map((item) => (
            <article className="ledger-row" key={item.roleKey}>
              <div className="ledger-meta">
                <span>{item.date[language]}</span>
                {item.orgUrl ? (
                  <a href={item.orgUrl} target="_blank" rel="noopener noreferrer" className="ledger-meta-dim">
                    {item.org} ↗
                  </a>
                ) : (
                  <span className="ledger-meta-dim">{item.org}</span>
                )}
              </div>
              <div className="ledger-main">
                <h3 className="ledger-title">{t(item.roleKey)}</h3>
                <p className="ledger-desc">{t(item.descKey)}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* SELECTED WORK */}
      <section id="projects" className="section reveal" aria-labelledby="projects-heading">
        <div className="section-head">
          <h2 id="projects-heading" className="section-title">
            {t('proj-title')}
          </h2>
        </div>

        <div className="ledger">
          <ProjectCard
            year="2026"
            title="OpenController"
            tags="Electron · TypeScript · USB HID"
            description={t('proj-opencontroller-desc')}
            link="https://github.com/mustafakemalz/opencontroller"
            linkText="GitHub ↗"
            image="/assets/projects/opencontroller.webp"
            imageAlt={t('proj-opencontroller-alt')}
          />
          <ProjectCard
            year="2025"
            title="Streamdoro"
            tags="Next.js · OBS · WebSocket"
            description={t('proj-streamdoro-desc')}
            link="https://streamdoro.app"
            linkText="streamdoro.app ↗"
            image="/assets/projects/streamdoro.webp"
            imageAlt={t('proj-streamdoro-alt')}
          />
          <ProjectCard
            year="2025"
            title="Fragstat"
            tags="React · FACEIT API · OBS"
            description={t('proj-fragstat-desc')}
            link="https://faceitoverlay.vercel.app"
            linkText="faceitoverlay.vercel.app ↗"
            image="/assets/projects/fragstat.webp"
            imageAlt={t('proj-fragstat-alt')}
          />
          <ProjectCard
            year="2025"
            title="ShareRoute"
            tags="React Native · Expo · Supabase"
            description={t('proj-shareroute-desc')}
            comingSoon
            statusText={t('proj-status-wip')}
          />
        </div>
      </section>

      {/* LAB & FIELD NOTES */}
      <section id="gallery" className="section reveal" aria-labelledby="gallery-heading">
        <div className="section-head">
          <h2 id="gallery-heading" className="section-title">
            {t('gallery-title')}
          </h2>
        </div>
        <div className="gallery-grid">
          {GALLERY.map((item) => (
            <figure className="gallery-figure" key={item.src}>
              <div className="gallery-img-wrap">
                <img src={item.src} alt={item.alt} loading="lazy" decoding="async" />
              </div>
              <figcaption className="gallery-caption">{t(item.captionKey)}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="section reveal" aria-labelledby="contact-heading">
        <div className="section-head">
          <h2 id="contact-heading" className="section-title">
            {t('contact-cta')}
          </h2>
        </div>
        <div className="ledger">
          <div className="ledger-row contact-row">
            <div className="contact-links-list">
              {CONTACT_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  {...(link.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  <span className="contact-link-label">{link.label}</span>
                  <span className="contact-link-handle">{link.handle}</span>
                </a>
              ))}
            </div>

            <div className="ledger-main contact-main">
              <p className="contact-lead">{t('contact-lead')}</p>
              <form
                id="contact-form"
                className="contact-form"
                action="https://formspree.io/f/xeeozdyd"
                method="POST"
                autoComplete="off"
                onSubmit={handleFormSubmit}
              >
                <div className="form-group">
                  <label htmlFor="name">{t('form-name')}</label>
                  <input type="text" name="name" id="name" required maxLength={120} />
                </div>
                <div className="form-group">
                  <label htmlFor="email">{t('form-email')}</label>
                  <input type="email" name="email" id="email" required maxLength={200} />
                </div>
                <div className="form-group">
                  <label htmlFor="message">{t('form-msg')}</label>
                  <textarea name="message" id="message" required maxLength={5000}></textarea>
                </div>
                <div className="form-actions">
                  <button type="submit" className="form-submit-link" disabled={isSubmitting}>
                    {isSubmitting ? t('form-sending') : t('form-btn')}
                  </button>
                  {formStatus && (
                    <span className="form-status-msg" role="status">
                      {formStatus}
                    </span>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default Home;
