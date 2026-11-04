import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation, type Language } from '../context/LanguageContext';
import { useSpotify } from '../hooks/useSpotify';
import PixelCompanion from '../components/PixelCompanion';
import { KICK_URL, SPOTIFY_PROFILE_URL } from '../config';

interface ChangelogEntry {
  year: number;
  titleKey: string;
  descKey: string;
}

const BIRTH_YEAR = 2004;

// Newest first. The version is the age that year; same-year entries count up as minor versions.
const CHANGELOG: ChangelogEntry[] = [
  { year: 2026, titleKey: 'j-10-title', descKey: 'j-10-desc' },
  { year: 2026, titleKey: 'j-9-title', descKey: 'j-9-desc' },
  { year: 2026, titleKey: 'j-8-title', descKey: 'j-8-desc' },
  { year: 2025, titleKey: 'j-7-title', descKey: 'j-7-desc' },
  { year: 2025, titleKey: 'j-6-title', descKey: 'j-6-desc' },
  { year: 2024, titleKey: 'j-5-title', descKey: 'j-5-desc' },
  { year: 2024, titleKey: 'j-4-title', descKey: 'j-4-desc' },
  { year: 2022, titleKey: 'j-3-title', descKey: 'j-3-desc' },
  { year: 2018, titleKey: 'j-2-title', descKey: 'j-2-desc' },
  { year: 2004, titleKey: 'j-1-title', descKey: 'j-1-desc' },
];

const versionFor = (index: number) => {
  const entry = CHANGELOG[index];
  const olderSameYear = CHANGELOG.slice(index + 1).filter((e) => e.year === entry.year).length;
  return `v${entry.year - BIRTH_YEAR}.${olderSameYear}`;
};

const timeAgo = (iso: string | undefined, language: Language) => {
  if (!iso) return '';
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const minutes = Math.round((then - Date.now()) / 60000);
  const rtf = new Intl.RelativeTimeFormat(language, { numeric: 'auto' });
  if (Math.abs(minutes) < 60) return rtf.format(minutes, 'minute');
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return rtf.format(hours, 'hour');
  return rtf.format(Math.round(hours / 24), 'day');
};

const NowListening: React.FC = () => {
  const { t, language } = useTranslation();
  const spotify = useSpotify();

  if (spotify.status === 'loading') {
    return <span className="now-track-skeleton">{t('now-loading')}</span>;
  }

  if (spotify.status === 'error') {
    return (
      <p className="now-text">
        <a href={SPOTIFY_PROFILE_URL} target="_blank" rel="noopener noreferrer" className="now-link">
          {t('now-spotify-fallback')}
        </a>
      </p>
    );
  }

  const { track, isLive } = spotify;
  const content = (
    <>
      {track.albumArt ? (
        <img className="now-track-art" src={track.albumArt} alt="" width={48} height={48} loading="lazy" />
      ) : (
        <span className="now-track-art" aria-hidden="true" />
      )}
      <span className="now-track-text">
        <span className="now-track-name">{track.name}</span>
        <span className="now-track-artist">{track.artist}</span>
        <span className="now-track-status">
          {isLive && <span className="live-dot" aria-hidden="true" />}
          {isLive ? t('now-playing-live') : timeAgo(track.playedAt, language)}
        </span>
      </span>
    </>
  );

  return track.url ? (
    <a className="now-track" href={track.url} target="_blank" rel="noopener noreferrer">
      {content}
    </a>
  ) : (
    <div className="now-track">{content}</div>
  );
};

export const Journey: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <header className="page-header">
        <Link to="/" className="page-back-link">
          {t('back-home')}
        </Link>
        <h1 className="page-title">{t('journey-title')}</h1>
        <p className="page-lead">{t('journey-desc')}</p>
      </header>

      {/* NOW */}
      <section className="section" aria-labelledby="now-heading">
        <div className="section-head">
          <h2 id="now-heading" className="section-title">
            {t('now-title')}
          </h2>
        </div>
        <div className="ledger">
          <div className="ledger-row now-row">
            <span className="ledger-meta">{t('now-listening')}</span>
            <NowListening />
          </div>
          <div className="ledger-row now-row">
            <span className="ledger-meta">{t('now-bench')}</span>
            <p className="now-text">{t('j-11-desc')}</p>
          </div>
          <div className="ledger-row now-row">
            <span className="ledger-meta">{t('now-streaming')}</span>
            <p className="now-text">
              {t('now-stream-text')}{' '}
              <a href={KICK_URL} target="_blank" rel="noopener noreferrer" className="now-link">
                kick.com/muskz
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* CHANGELOG */}
      <section className="section reveal" aria-labelledby="changelog-heading">
        <div className="section-head">
          <h2 id="changelog-heading" className="section-title">
            {t('changelog-title')}
          </h2>
          <span className="section-note">{t('changelog-note')}</span>
        </div>
        <ol className="ledger">
          {CHANGELOG.map((entry, index) => (
            <li key={entry.titleKey} className="ledger-row changelog-row">
              <span className="ledger-meta changelog-meta">
                <span className="changelog-version">{versionFor(index)}</span>
                <span className="ledger-meta-dim">{entry.year}</span>
              </span>
              <div className="ledger-main">
                <h3 className="ledger-title">{t(entry.titleKey)}</h3>
                <p className="ledger-desc">{t(entry.descKey)}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* SIDE QUESTS */}
      <section className="section reveal" aria-labelledby="quests-heading">
        <div className="section-head">
          <h2 id="quests-heading" className="section-title">
            {t('quests-title')}
          </h2>
        </div>
        <div className="quest-grid">
          <Link to="/sistem" className="quest-card">
            <span className="quest-kicker">/sistem</span>
            <span className="quest-title">{t('quest-setup-title')}</span>
            <span className="quest-desc">{t('quest-setup-desc')}</span>
            <span className="quest-foot">{t('quest-setup-foot')}</span>
          </Link>
          <a href={KICK_URL} target="_blank" rel="noopener noreferrer" className="quest-card">
            <span className="quest-kicker">kick.com/muskz</span>
            <span className="quest-title">{t('quest-stream-title')}</span>
            <span className="quest-desc">{t('quest-stream-desc')}</span>
            <span className="quest-foot">{t('quest-stream-foot')}</span>
          </a>
          <PixelCompanion />
        </div>
      </section>
    </>
  );
};
export default Journey;
