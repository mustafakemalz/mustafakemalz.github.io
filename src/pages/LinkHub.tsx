import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../context/LanguageContext';
import './LinkHub.css';

interface LinkItem {
  id: string;
  title: string;
  handle: string;
  url: string;
  brandColor: string;
  iconSvg: React.ReactNode;
}

export const LinkHub: React.FC = () => {
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const links: LinkItem[] = [
    {
      id: 'github',
      title: 'GitHub',
      handle: 'github.com/mustafakemalz ↗',
      url: 'https://github.com/mustafakemalz',
      brandColor: 'var(--foreground-heading)',
      iconSvg: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.207 11.387.6.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.5 11.5 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
        </svg>
      ),
    },
    {
      id: 'linkedin',
      title: 'LinkedIn',
      handle: 'in/mustafa-kemal-göçer ↗',
      url: 'https://www.linkedin.com/in/mustafa-kemal-g%C3%B6%C3%A7er-41409b255/',
      brandColor: '#0A66C2',
      iconSvg: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
        </svg>
      ),
    },
    {
      id: 'instagram',
      title: 'Instagram',
      handle: '@jpeg.muskz ↗',
      url: 'https://www.instagram.com/jpeg.muskz/',
      brandColor: '#E1306C',
      iconSvg: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
      ),
    },
    {
      id: 'kick',
      title: 'Kick',
      handle: 'kick.com/muskz ↗',
      url: 'https://kick.com/muskz',
      brandColor: '#53FC18',
      iconSvg: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M4 3h5v6h3V6h3V3h5v6h-3v3h3v6h-5v-3h-3v-3H9v6H4V3z" />
        </svg>
      ),
    },
    {
      id: 'twitch',
      title: 'Twitch',
      handle: 'twitch.tv/muskz_ ↗',
      url: 'https://twitch.tv/muskz_',
      brandColor: '#9146FF',
      iconSvg: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M2.5 2h19v14h-5l-4 4v-4h-4L2.5 15V2zm3 3v8h3v-8h-3zm6 0v8h3v-8h-3z" />
        </svg>
      ),
    },
    {
      id: 'spotify',
      title: 'Spotify',
      handle: 'open.spotify.com ↗',
      url: 'https://open.spotify.com/user/0wu2ixnxr61i99ci84hgtlolr',
      brandColor: '#1DB954',
      iconSvg: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2A10 10 0 1 0 22 12 10 10 0 0 0 12 2zm4.5 14.4a.6.6 0 0 1-.8.2c-2.3-1.4-5.2-1.7-8.6-.9a.6.6 0 1 1-.3-1.2c3.8-.9 7-.5 9.6 1.1a.6.6 0 0 1 .1.8zm1.2-2.7a.8.8 0 0 1-1 .3c-2.7-1.6-6.7-2.1-9.8-1.2a.8.8 0 0 1-.4-1.5c3.6-1.1 8-.5 11.1 1.4a.8.8 0 0 1 .1 1zm.1-2.8c-3.2-1.9-8.5-2.1-11.6-1.1a1 1 0 0 1-.6-1.9c3.6-1.1 9.4-.9 13.1 1.3a1 1 0 0 1-1 1.7z" />
        </svg>
      ),
    },
    {
      id: 'mail',
      title: 'Email',
      handle: 'mustafakemalgocer@gmail.com ↗',
      url: 'mailto:mustafakemalgocer@gmail.com',
      brandColor: '#38BDF8',
      iconSvg: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="16" rx="2"></rect>
          <polyline points="21,6 12,13 3,6"></polyline>
        </svg>
      ),
    },
  ];

  return (
    <div className="hub-page">
      <header className="hub-header reveal">
        <Link to="/" className="hub-back-link" data-lang="back-home">
          {t('back-home')}
        </Link>
        <h1 className="hub-title">Mustafa Kemal Göçer</h1>
        <p className="hub-role" data-lang="hero-role">
          {t('hero-role')}
        </p>
      </header>

      <div className="hub-ledger reveal">
        {links.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target={link.url.startsWith('mailto:') ? undefined : '_blank'}
            rel={link.url.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
            className="hub-row"
            style={{ '--brand-color': link.brandColor } as React.CSSProperties}
          >
            <div className="hub-row-left">
              <span className="hub-row-icon">{link.iconSvg}</span>
              <span className="hub-row-name">{link.title}</span>
            </div>
            <span className="hub-row-handle">{link.handle}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default LinkHub;
