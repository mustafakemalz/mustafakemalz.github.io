import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../context/LanguageContext';
import './LinkedInRedirect.css';

const LINKEDIN_URL = 'https://www.linkedin.com/in/mustafa-kemal-g%C3%B6%C3%A7er-41409b255/';

export const LinkedInRedirect: React.FC = () => {
  const { language } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      window.location.href = LINKEDIN_URL;
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="li-page-container reveal">
      <p className="li-mono-tag">linkedin.com/in/mustafa-kemal-göçer</p>
      <h1 className="li-title">
        {language === 'tr'
          ? 'LinkedIn profiline yönlendiriliyor...'
          : 'Redirecting to LinkedIn...'}
      </h1>

      <div className="li-progress-bar-bg">
        <div className="li-progress-bar-fill" />
      </div>

      <div className="li-actions">
        <a href={LINKEDIN_URL} className="li-link-primary">
          {language === 'tr' ? 'Doğrudan aç ↗' : 'Open directly ↗'}
        </a>
        <Link to="/" className="li-link-secondary">
          {language === 'tr' ? '← İndeks' : '← Index'}
        </Link>
      </div>
    </div>
  );
};

export default LinkedInRedirect;
