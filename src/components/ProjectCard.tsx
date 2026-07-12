import React, { useRef } from 'react';

interface ProjectCardProps {
  title: string;
  tags: string;
  description: string;
  link?: string;
  linkText?: string;
  comingSoon?: boolean;
  visualClass?: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  tags,
  description,
  link,
  linkText = 'Live Demo →',
  comingSoon = false,
  visualClass = '',
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const frameId = useRef<number>(0);

  const resetCard = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty('--card-tilt-x', '0deg');
    card.style.setProperty('--card-tilt-y', '0deg');
    card.style.setProperty('--card-shift-x', '0px');
    card.style.setProperty('--card-shift-y', '0px');
    card.style.setProperty('--card-media-x', '0px');
    card.style.setProperty('--card-media-y', '0px');
  };

  const updateCard = (event: React.PointerEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    const clampedX = Math.min(1, Math.max(0, x));
    const clampedY = Math.min(1, Math.max(0, y));

    const tiltY = (clampedX - 0.5) * 12;
    const tiltX = (0.5 - clampedY) * 10;
    const shiftX = (clampedX - 0.5) * 12;
    const shiftY = (clampedY - 0.5) * 12;

    card.style.setProperty('--card-tilt-x', `${tiltX.toFixed(2)}deg`);
    card.style.setProperty('--card-tilt-y', `${tiltY.toFixed(2)}deg`);
    card.style.setProperty('--card-shift-x', `${shiftX.toFixed(2)}px`);
    card.style.setProperty('--card-shift-y', `${shiftY.toFixed(2)}px`);
    card.style.setProperty('--card-media-x', `${(-shiftX * 0.55).toFixed(2)}px`);
    card.style.setProperty('--card-media-y', `${(-shiftY * 0.55).toFixed(2)}px`);
  };

  const handlePointerEnter = () => {
    resetCard();
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (prefersReducedMotion || !canHover) return;

    if (frameId.current) {
      cancelAnimationFrame(frameId.current);
    }

    frameId.current = requestAnimationFrame(() => updateCard(event));
  };

  const handlePointerLeave = () => {
    if (frameId.current) {
      cancelAnimationFrame(frameId.current);
    }
    resetCard();
  };

  return (
    <article
      className="project-card"
      ref={cardRef}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className={`project-visual ${visualClass}`}>
        <div className="project-visual-media" aria-hidden="true"></div>
        <div className="project-visual-inner">{title}</div>
      </div>
      <div className="project-body">
        <div className="project-tags">{tags}</div>
        <h3>{title}</h3>
        <p>{description}</p>
        {comingSoon ? (
          <span className="project-badge">Coming Soon</span>
        ) : link ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="project-link"
          >
            {linkText}
          </a>
        ) : null}
      </div>
    </article>
  );
};
export default ProjectCard;
