import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../context/LanguageContext';

interface TimelineItem {
  year: string;
  titleKey: string;
  descKey: string;
}

export const Journey: React.FC = () => {
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const timelineItems: TimelineItem[] = [
    { year: '2004', titleKey: 'j-1-title', descKey: 'j-1-desc' },
    { year: '2018', titleKey: 'j-2-title', descKey: 'j-2-desc' },
    { year: '2022', titleKey: 'j-3-title', descKey: 'j-3-desc' },
    { year: '2024', titleKey: 'j-4-title', descKey: 'j-4-desc' },
    { year: '2024', titleKey: 'j-5-title', descKey: 'j-5-desc' },
    { year: '2025', titleKey: 'j-6-title', descKey: 'j-6-desc' },
    { year: '2025', titleKey: 'j-7-title', descKey: 'j-7-desc' },
    { year: '2026', titleKey: 'j-8-title', descKey: 'j-8-desc' },
    { year: '2026', titleKey: 'j-9-title', descKey: 'j-9-desc' },
    { year: '2026', titleKey: 'j-10-title', descKey: 'j-10-desc' },
    { year: 'Now', titleKey: 'j-11-title', descKey: 'j-11-desc' },
  ];

  return (
    <>
      <header className="journey-header-area reveal">
        <Link to="/" className="journey-back-link" data-lang="back-home">
          {t('back-home')}
        </Link>
        <h1 className="journey-page-title" data-lang="journey-title">
          {t('journey-title')}
        </h1>
        <p className="journey-lead" data-lang="journey-desc">
          {t('journey-desc')}
        </p>
      </header>

      <section className="section reveal" style={{ paddingTop: '1.5rem' }} aria-label="Journey timeline">
        <div className="journey-timeline" id="journey-timeline">
          {timelineItems.map((item, idx) => (
            <div key={idx} className="journey-item" data-year={item.year}>
              <div className="journey-year">{item.year}</div>
              <div className="journey-content">
                <h3 data-lang={item.titleKey}>{t(item.titleKey)}</h3>
                <p data-lang={item.descKey}>{t(item.descKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};
export default Journey;
