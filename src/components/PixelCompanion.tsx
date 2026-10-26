import React, { useState, useRef } from 'react';
import { useTranslation } from '../context/LanguageContext';

export const PixelCompanion: React.FC = () => {
  const { language } = useTranslation();
  const [thought, setThought] = useState<string | null>(null);
  const thoughtTimerRef = useRef<number | null>(null);

  const handleClick = () => {
    const thoughtsTr = [
      '// biraz mola',
      'git commit -m "dinlen"',
      'npm run nefes-al',
      '// kahve zamanı ☕',
      '5 dk dinlenme...',
      'while(alive) { code(); }',
    ];
    const thoughtsEn = [
      '// quick break',
      'git commit -m "stretch"',
      'npm run take-a-breath',
      '// coffee time ☕',
      '5 min stretch...',
      'while(alive) { code(); }',
    ];
    const list = language === 'tr' ? thoughtsTr : thoughtsEn;
    const randomThought = list[Math.floor(Math.random() * list.length)];

    setThought(randomThought);

    if (thoughtTimerRef.current) {
      window.clearTimeout(thoughtTimerRef.current);
    }
    thoughtTimerRef.current = window.setTimeout(() => {
      setThought(null);
    }, 2800);
  };

  return (
    <div
      className="pixel-companion-shelf"
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      role="button"
      tabIndex={0}
      title={language === 'tr' ? 'Mola vermek için tıkla' : 'Click to take a stretch break'}
      aria-label="Pixel developer companion"
    >
      {thought && (
        <span className="pixel-companion-bubble" aria-live="polite">
          {thought}
        </span>
      )}

      <div className="pixel-companion-frame">
        <img
          src="/assets/dev-companion.gif"
          alt="Pixel developer coding and stretching"
          className="pixel-dev-gif"
          width={62}
          height={48}
          loading="eager"
          decoding="async"
        />
      </div>
    </div>
  );
};

export default PixelCompanion;
