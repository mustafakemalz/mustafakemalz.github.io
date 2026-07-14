import React, { useState, useEffect } from 'react';
import { useTranslation } from '../context/LanguageContext';

interface Track {
  name: string;
  artist: string;
  album: string;
  albumArt: string;
  albumArtSmall: string;
  url: string;
  playedAt: string;
  duration: number;
  previewUrl: string;
}

export const SpotifyWidget: React.FC = () => {
  const { t } = useTranslation();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const SPOTIFY_API_URL =
    window.location.hostname === 'mustafakemalz.github.io'
      ? 'https://mustafakemalz-spotify-api.vercel.app/api/spotify'
      : '/api/spotify';

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await fetch(SPOTIFY_API_URL);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        setTracks(data.tracks || []);
      } catch (err) {
        console.warn('Spotify fetch error:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
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

  if (error || tracks.length === 0) {
    return (
      <div className="widget-content">
        <div className="widget-empty">
          <i className="fa-brands fa-spotify"></i>
          <span>{t('spotify-empty')}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="widget-content" style={{ display: 'flex', flexDirection: 'column' }}>
      {tracks.slice(0, 4).map((track, idx) => (
        <a
          href={track.url}
          target="_blank"
          rel="noopener noreferrer"
          className="spotify-row"
          key={idx}
        >
          <div className="spotify-row-art">
            <img
              src={track.albumArtSmall || track.albumArt}
              alt={track.album}
              loading="lazy"
            />
          </div>
          <div className="spotify-row-info">
            <div className="spotify-row-name">{track.name}</div>
            <div className="spotify-row-artist">{track.artist}</div>
          </div>
        </a>
      ))}
    </div>
  );
};
export default SpotifyWidget;
