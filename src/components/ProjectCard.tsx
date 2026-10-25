import React from 'react';

interface ProjectCardProps {
  title: string;
  tags: string;
  description: string;
  link?: string;
  linkText?: string;
  comingSoon?: boolean;
  year?: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  tags,
  description,
  link,
  linkText = 'View ↗',
  comingSoon = false,
  year,
}) => {
  return (
    <article className="project-row">
      <div className="project-row-meta">
        {year && <span className="project-row-year">{year}</span>}
        <span className="project-row-stack">{tags}</span>
      </div>
      <div className="project-row-main">
        <div className="project-row-head">
          <h3>{title}</h3>
          {comingSoon ? (
            <span className="project-row-status">WIP</span>
          ) : link ? (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="project-row-link"
            >
              {linkText}
            </a>
          ) : null}
        </div>
        <p className="project-row-desc">{description}</p>
      </div>
    </article>
  );
};
export default ProjectCard;
