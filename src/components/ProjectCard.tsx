import React from 'react';

interface ProjectCardProps {
  title: string;
  tags: string;
  description: string;
  link?: string;
  linkText?: string;
  comingSoon?: boolean;
  statusText?: string;
  year?: string;
  image?: string;
  imageAlt?: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  tags,
  description,
  link,
  linkText = 'View ↗',
  comingSoon = false,
  statusText = 'WIP',
  year,
  image,
  imageAlt = '',
}) => {
  const shot = image ? <img src={image} alt={imageAlt} loading="lazy" decoding="async" /> : null;

  return (
    <article className="ledger-row project-row">
      <div className="ledger-meta">
        {year && <span>{year}</span>}
        <span className="ledger-meta-dim">{tags}</span>
      </div>
      <div className="project-body">
        <div className="ledger-main">
          <div className="project-row-head">
            <h3 className="ledger-title">{title}</h3>
            {comingSoon ? (
              <span className="project-row-status">{statusText}</span>
            ) : link ? (
              <a href={link} target="_blank" rel="noopener noreferrer" className="project-row-link">
                {linkText}
              </a>
            ) : null}
          </div>
          <p className="ledger-desc">{description}</p>
        </div>
        {shot &&
          (link ? (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="project-shot"
              tabIndex={-1}
              aria-hidden="true"
            >
              {shot}
            </a>
          ) : (
            <div className="project-shot">{shot}</div>
          ))}
      </div>
    </article>
  );
};
export default ProjectCard;
