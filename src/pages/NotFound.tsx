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
    <div className="not-found-container reveal">
      <div className="not-found-canvas-wrapper">
        <FuzzyText
          key={theme}
          baseIntensity={0.14}
          hoverIntensity={0.35}
          enableHover={true}
          fontSize="clamp(3.5rem, 12vw, 7.5rem)"
          fontWeight={500}
          color="var(--foreground-heading)"
        >
          404
        </FuzzyText>
      </div>

      <h1 className="not-found-title">{t('not-found-title')}</h1>
      <p className="not-found-desc">{t('not-found-desc')}</p>

      <div className="not-found-actions">
        <Link to="/" className="not-found-back-link">
          {t('not-found-back')}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
