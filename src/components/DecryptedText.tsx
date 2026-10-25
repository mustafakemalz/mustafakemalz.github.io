import React, { useEffect, useRef, useState } from 'react';

interface DecryptedTextProps {
  text: string;
  className?: string;
  speed?: number;
  chars?: string;
  animateOnHover?: boolean;
}

const DEFAULT_CHARS = '01#$>_/*+~:;=';

export const DecryptedText: React.FC<DecryptedTextProps> = ({
  text,
  className = '',
  speed = 28,
  chars = DEFAULT_CHARS,
  animateOnHover = true,
}) => {
  const [displayText, setDisplayText] = useState(text);
  const rafRef = useRef<number | null>(null);
  const runAnimationRef = useRef<() => void>(() => {});

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setDisplayText(text);
      return;
    }

    let startTime = 0;
    const totalDuration = Math.min(720, Math.max(360, text.length * speed));

    const step = (now: number) => {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / totalDuration);
      const revealedCount = Math.floor(progress * text.length);

      if (progress >= 1) {
        setDisplayText(text);
        rafRef.current = null;
        return;
      }

      let out = '';
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (ch === ' ' || i < revealedCount) {
          out += ch;
        } else {
          const idx = (i * 7 + Math.floor(elapsed / 35)) % chars.length;
          out += chars[idx];
        }
      }
      setDisplayText(out);
      rafRef.current = requestAnimationFrame(step);
    };

    const start = () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      startTime = 0;
      rafRef.current = requestAnimationFrame(step);
    };

    runAnimationRef.current = start;
    start();

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [text, speed, chars]);

  return (
    <span
      className={`decrypted-text ${className}`.trim()}
      onMouseEnter={animateOnHover ? () => runAnimationRef.current() : undefined}
    >
      {displayText}
    </span>
  );
};

export default DecryptedText;
