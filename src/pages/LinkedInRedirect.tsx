import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../context/LanguageContext';
import './LinkedInRedirect.css';

const LINKEDIN_URL = "https://www.linkedin.com/in/mustafa-kemal-g%C3%B6%C3%A7er-41409b255/";

export const LinkedInRedirect: React.FC = () => {
  const { language } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      window.location.href = LINKEDIN_URL;
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="li-page-container">
      <div className="li-card-wrap">
        <div className="li-card-glow" />
        
        <div className="li-brand-icon-wrap">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
          </svg>
        </div>

        <h1 className="li-title">Mustafa Kemal Göçer</h1>
        <p className="li-desc">
          {language === 'tr'
            ? 'LinkedIn profilime yönlendiriliyorsunuz...'
            : 'Redirecting to LinkedIn profile...'}
        </p>

        <div className="li-progress-bar-bg">
          <div className="li-progress-bar-fill" />
        </div>

        <div className="li-actions">
          <a href={LINKEDIN_URL} className="li-btn-primary">
            {language === 'tr' ? 'Şimdi Git' : 'Go Now'}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>

          <Link to="/" className="li-btn-secondary">
            {language === 'tr' ? 'Ana Sayfaya Dön' : 'Back to Home'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LinkedInRedirect;
