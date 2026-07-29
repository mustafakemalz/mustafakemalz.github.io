import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import FuzzyText from '../components/FuzzyText';
import { useTranslation } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import './NotFound.css';

export const NotFound: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="not-found-container">
      <div className="not-found-glow" />

      <div className="not-found-canvas-wrapper">
        <FuzzyText
          key={theme}
          baseIntensity={0.18}
          hoverIntensity={0.45}
          enableHover={true}
          fontSize="clamp(4rem, 16vw, 11rem)"
          fontWeight={900}
          color="var(--foreground-heading)"
        >
          404
        </FuzzyText>
      </div>

      <h1 className="not-found-title">{t('not-found-title')}</h1>
      <p className="not-found-desc">{t('not-found-desc')}</p>

      <div className="not-found-actions">
        <Link to="/" className="not-found-btn-primary">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="not-found-btn-icon"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          <span>{t('not-found-back')}</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
