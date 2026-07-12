import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../context/LanguageContext';

interface TimelineItem {
  year: string;
  titleKey: string;
  descKey: string;
  isFuture?: boolean;
}

export const Journey: React.FC = () => {
  const { t } = useTranslation();
  const timelineRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll restoration to top on mount
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const timeline = timelineRef.current;
      const progressFill = progressFillRef.current;
      if (!timeline || !progressFill) return;

      const scrollY = window.scrollY;
      const rect = timeline.getBoundingClientRect();
      const timelineTop = rect.top + scrollY;
      const timelineHeight = rect.height;

      const viewportMiddle = scrollY + window.innerHeight * 0.6;
      const progress = Math.min(1, Math.max(0, (viewportMiddle - timelineTop) / timelineHeight));

      progressFill.style.height = `${progress * 100}%`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial trigger
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const timelineItems: TimelineItem[] = [
    { year: '2004', titleKey: 'j-1-title', descKey: 'j-1-desc' },
    { year: '2018', titleKey: 'j-2-title', descKey: 'j-2-desc' },
    { year: '2022', titleKey: 'j-3-title', descKey: 'j-3-desc' },
    { year: '2024', titleKey: 'j-4-title', descKey: 'j-4-desc' },
    { year: '2024', titleKey: 'j-5-title', descKey: 'j-5-desc' },
    { year: '2025', titleKey: 'j-6-title', descKey: 'j-6-desc' },
    { year: '2025', titleKey: 'j-7-title', descKey: 'j-7-desc' },
    { year: '∞', titleKey: 'j-8-title', descKey: 'j-8-desc', isFuture: true },
  ];

  return (
    <>
      {/* Back Link & Header */}
      <div className="journey-header-area reveal">
        <Link to="/" className="journey-back-link" data-lang="back-home">
          {t('back-home')}
        </Link>
        <h1 className="section-title" style={{ marginTop: '1.5rem' }} data-lang="journey-title">
          {t('journey-title')}
        </h1>
        <p className="section-text" data-lang="journey-desc">
          {t('journey-desc')}
        </p>
      </div>

      {/* ═══════════════ JOURNEY TIMELINE ═══════════════ */}
      <section className="section reveal" style={{ paddingTop: '2rem' }} aria-label="Journey timeline">
        <div className="journey-timeline" id="journey-timeline" ref={timelineRef}>
          <div className="journey-progress-track">
            <div
              className="journey-progress-fill"
              id="journey-progress-fill"
              ref={progressFillRef}
            ></div>
          </div>

          {timelineItems.map((item, idx) => (
            <div
              key={idx}
              className={`journey-item reveal-journey ${item.isFuture ? 'journey-item--future' : ''}`}
              data-year={item.year}
            >
              <div className="journey-year">{item.year}</div>
              <div className={`journey-dot ${item.isFuture ? 'journey-dot--pulse' : ''}`}></div>
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
