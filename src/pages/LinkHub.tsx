import React, { useEffect } from 'react';
import './LinkHub.css';

interface LinkItem {
  id: string;
  title: string;
  url: string;
  brandColor: string;
  brandGlow: string;
  brandBorder: string;
  iconSvg: React.ReactNode;
}

export const LinkHub: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const links: LinkItem[] = [
    {
      id: 'linkedin',
      title: 'LinkedIn',
      url: 'https://www.linkedin.com/in/mustafa-kemal-g%C3%B6%C3%A7er-41409b255/',
      brandColor: '#0A66C2',
      brandGlow: 'rgba(10, 102, 194, 0.35)',
      brandBorder: 'rgba(10, 102, 194, 0.45)',
      iconSvg: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
        </svg>
      ),
    },
    {
      id: 'kick',
      title: 'Kick',
      url: 'https://kick.com/muskz',
      brandColor: '#53FC18',
      brandGlow: 'rgba(83, 252, 24, 0.3)',
      brandBorder: 'rgba(83, 252, 24, 0.45)',
      iconSvg: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 3h4.8v6.4h2.9V3h4.8v6.4h-2.9v2.4h2.9v6.4H10.7v-6.4H7.8v6.4H3V3z"/>
        </svg>
      ),
    },
    {
      id: 'twitch',
      title: 'Twitch',
      url: 'https://twitch.tv/muskz',
      brandColor: '#a970ff',
      brandGlow: 'rgba(145, 70, 255, 0.35)',
      brandBorder: 'rgba(145, 70, 255, 0.45)',
      iconSvg: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M2.5 2h19v14h-5l-4 4v-4h-4L2.5 15V2zm3 3v8h3v-8h-3zm6 0v8h3v-8h-3z"/>
        </svg>
      ),
    },
    {
      id: 'youtube',
      title: 'YouTube',
      url: 'https://youtube.com/@muskz',
      brandColor: '#ff4d4d',
      brandGlow: 'rgba(255, 0, 0, 0.35)',
      brandBorder: 'rgba(255, 0, 0, 0.45)',
      iconSvg: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21.58 7.19a2.7 2.7 0 0 0-1.9-1.9C18 4.75 12 4.75 12 4.75s-6 0-7.68.54a2.7 2.7 0 0 0-1.9 1.9A28.3 28.3 0 0 0 1.88 12a28.3 28.3 0 0 0 .54 4.81 2.7 2.7 0 0 0 1.9 1.9c1.68.54 7.68.54 7.68.54s6 0 7.68-.54a2.7 2.7 0 0 0 1.9-1.9 28.3 28.3 0 0 0 .54-4.81 28.3 28.3 0 0 0-.54-4.81zM9.75 15.02V8.98L15 12l-5.25 3.02z"/>
        </svg>
      ),
    },
    {
      id: 'instagram',
      title: 'Instagram',
      url: 'https://instagram.com/muskz',
      brandColor: '#f472b6',
      brandGlow: 'rgba(225, 48, 108, 0.35)',
      brandBorder: 'rgba(225, 48, 108, 0.45)',
      iconSvg: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
      ),
    },
    {
      id: 'spotify',
      title: 'Spotify',
      url: 'https://open.spotify.com',
      brandColor: '#1DB954',
      brandGlow: 'rgba(29, 185, 84, 0.35)',
      brandBorder: 'rgba(29, 185, 84, 0.45)',
      iconSvg: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2A10 10 0 1 0 22 12 10 10 0 0 0 12 2zm4.5 14.4a.6.6 0 0 1-.8.2c-2.3-1.4-5.2-1.7-8.6-.9a.6.6 0 1 1-.3-1.2c3.8-.9 7-.5 9.6 1.1a.6.6 0 0 1 .1.8zm1.2-2.7a.8.8 0 0 1-1 .3c-2.7-1.6-6.7-2.1-9.8-1.2a.8.8 0 0 1-.4-1.5c3.6-1.1 8-.5 11.1 1.4a.8.8 0 0 1 .1 1zm.1-2.8c-3.2-1.9-8.5-2.1-11.6-1.1a1 1 0 0 1-.6-1.9c3.6-1.1 9.4-.9 13.1 1.3a1 1 0 0 1-1 1.7z"/>
        </svg>
      ),
    },
    {
      id: 'mail',
      title: 'Mail',
      url: 'mailto:contact@muskz.dev',
      brandColor: '#38bdf8',
      brandGlow: 'rgba(56, 189, 248, 0.35)',
      brandBorder: 'rgba(56, 189, 248, 0.45)',
      iconSvg: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="16" rx="2"></rect>
          <polyline points="21,6 12,13 3,6"></polyline>
        </svg>
      ),
    },
  ];

  return (
    <div className="hub-container">
      {/* 12-Column Responsive Grid */}
      <div className="hub-grid-12">
        {/* --- HERO PROFILE (Span 12 Columns) --- */}
        <section className="hub-hero-col">
          <img
            src="/assets/muskz-profile.png"
            alt="Mustafa Kemal Göçer"
            className="hub-avatar-img"
          />
          <h1 className="hub-name">Mustafa Kemal Göçer</h1>
        </section>

        {/* --- LINKS LIST (Span 12 Columns Each) --- */}
        {links.map((link) => (
          <div key={link.id} className="hub-link-col">
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hub-link-item"
              style={{
                '--brand-color': link.brandColor,
                '--brand-glow': link.brandGlow,
                '--brand-border': link.brandBorder,
              } as React.CSSProperties}
            >
              <div className="hub-link-left">
                <div className="hub-link-icon">{link.iconSvg}</div>
                <span className="hub-link-title">{link.title}</span>
              </div>
              <div className="hub-link-arrow">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="7" y1="17" x2="17" y2="7"></line>
                  <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LinkHub;
