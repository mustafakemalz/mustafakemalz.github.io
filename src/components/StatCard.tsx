import React, { useEffect, useRef, useState } from 'react';

interface StatCardProps {
  count: number;
  suffix?: string;
  label: string;
}

export const StatCard: React.FC<StatCardProps> = ({ count, suffix = '', label }) => {
  const [displayCount, setDisplayCount] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          animateCounter();
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.5 }
    );

    const el = elementRef.current;
    if (el) {
      observer.observe(el);
    }

    const animateCounter = () => {
      const duration = 2200;
      const start = performance.now();

      const easeOutExpo = (t: number) => {
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      };

      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = easeOutExpo(progress);
        const current = Math.round(eased * count);
        setDisplayCount(current);

        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      };

      requestAnimationFrame(tick);
    };

    return () => {
      if (el) {
        observer.disconnect();
      }
    };
  }, [count]);

  return (
    <div className="stat-card" ref={elementRef}>
      <span className="stat-number">
        {displayCount}
        {suffix}
      </span>
      <span className="stat-label">{label}</span>
    </div>
  );
};
export default StatCard;
