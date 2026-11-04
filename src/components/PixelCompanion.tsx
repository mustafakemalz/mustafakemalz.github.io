import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from '../context/LanguageContext';

const THOUGHTS = {
  tr: [
    '// biraz mola',
    'git commit -m "dinlen"',
    'npm run nefes-al',
    '// kahve zamanı',
    '5 dk esneme',
    'while (alive) { code(); }',
  ],
  en: [
    '// quick break',
    'git commit -m "stretch"',
    'npm run take-a-breath',
    '// coffee time',
    '5 min stretch',
    'while (alive) { code(); }',
  ],
};

// Side-quest card on /journey: a pixel developer who suggests a break when clicked
export const PixelCompanion: React.FC = () => {
  const { t, language } = useTranslation();
  const [thought, setThought] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    },
    []
  );

  const handleClick = () => {
    const list = THOUGHTS[language];
    setThought((prev) => {
      const options = list.filter((item) => item !== prev);
      return options[Math.floor(Math.random() * options.length)];
    });
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setThought(null), 2800);
  };

  return (
    <button type="button" className="quest-card" onClick={handleClick}>
      <span className="quest-kicker">{t('quest-buddy-kicker')}</span>
      <span className="quest-title">{t('quest-buddy-title')}</span>
      <span className="quest-desc">{t('quest-buddy-desc')}</span>
      <span className="quest-companion">
        <img
          src="/assets/dev-companion.gif"
          alt=""
          className="pixel-dev-gif"
          width={61}
          height={48}
          decoding="async"
        />
        {thought && (
          <span className="quest-bubble" aria-live="polite">
            {thought}
          </span>
        )}
      </span>
    </button>
  );
};

export default PixelCompanion;
