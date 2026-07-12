import React, { useState, useEffect } from 'react';

interface Repo {
  name: string;
  description: string | null;
  html_url: string;
  fork: boolean;
}

export const GithubWidget: React.FC = () => {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await fetch(
          'https://api.github.com/users/mustafakemalz/repos?sort=updated&per_page=4'
        );
        if (!response.ok) throw new Error('GitHub API Error');
        const data = await response.json();
        setRepos(data || []);
      } catch (err) {
        console.warn('GitHub fetch error:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  if (loading) {
    return (
      <div className="widget-content">
        {[1, 2, 3].map((n) => (
          <div className="skeleton-row" key={n}>
            <div className="skeleton-circle"></div>
            <div className="skeleton-info">
              <div className="skeleton-line skeleton-title"></div>
              <div className="skeleton-line skeleton-artist"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error || repos.length === 0) {
    return (
      <div className="widget-content">
        <div className="widget-empty">
          <i className="fa-brands fa-github"></i>
          <span>Failed to load repositories</span>
        </div>
      </div>
    );
  }

  return (
    <div className="widget-content" style={{ display: 'flex', flexDirection: 'column' }}>
      {repos.map((repo, idx) => (
        <a
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="github-row"
          key={idx}
        >
          <div className="github-row-icon">
            <i className="fa-solid fa-code-branch"></i>
          </div>
          <div className="github-row-info">
            <div className="github-row-name">
              {repo.name}
              {repo.fork ? ' (Fork)' : ''}
            </div>
            <div className="github-row-desc">
              {repo.description || 'No description provided'}
            </div>
          </div>
        </a>
      ))}
    </div>
  );
};
export default GithubWidget;
