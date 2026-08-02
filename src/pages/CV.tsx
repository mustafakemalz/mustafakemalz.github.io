import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../context/LanguageContext';
import './CV.css';

export const CV: React.FC = () => {
  const { t, language } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const cvPdfPath = '/assets/cv.pdf';

  return (
    <div className="cv-page-container">
      <div className="cv-header-wrap">
        <h1 className="cv-title">Mustafa Kemal Göçer</h1>
        <p className="cv-subtitle">
          {language === 'tr'
            ? 'Front-End / Full-Stack & AI Destekli Geliştirici | Elektrik-Elektronik Mühendisi Öğrencisi'
            : 'Front-End / Full-Stack & AI Developer | Electrical-Electronics Engineering Student'}
        </p>

        <div className="cv-actions-bar">
          <a
            href={cvPdfPath}
            download="Mustafa_Kemal_Gocer_CV.pdf"
            className="cv-action-btn cv-action-btn--primary"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            {language === 'tr' ? 'PDF İndir' : 'Download PDF'}
          </a>

          <a
            href={cvPdfPath}
            target="_blank"
            rel="noopener noreferrer"
            className="cv-action-btn cv-action-btn--secondary"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
            {language === 'tr' ? 'Yeni Sekmede Aç' : 'Open in New Tab'}
          </a>

          <Link to="/" className="cv-action-btn cv-action-btn--secondary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            {language === 'tr' ? 'Ana Sayfaya Dön' : 'Back to Home'}
          </Link>
        </div>
      </div>

      <div className="cv-viewer-frame-wrap">
        <iframe
          src={`${cvPdfPath}#toolbar=0&navpanes=0`}
          title="Mustafa Kemal Göçer CV"
          className="cv-viewer-iframe"
        />
      </div>
    </div>
  );
};

export default CV;
