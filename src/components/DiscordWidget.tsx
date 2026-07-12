import React from 'react';
import { useDiscordStatus } from '../hooks/useDiscordStatus';

export const DiscordWidget: React.FC = () => {
  const statusData = useDiscordStatus();

  if (!statusData) {
    return (
      <div className="discord-card" id="discord-widget" style={{ pointerEvents: 'none' }}>
        <div className="d-avatar-wrapper">
          <div className="skeleton-circle" style={{ width: '40px', height: '40px', borderRadius: '50%' }}></div>
        </div>
        <div className="d-info">
          <div className="d-header">
            <span id="d-username">Loading...</span>
          </div>
          <div className="d-activity">
            <span id="d-activity-text">Connecting to Discord...</span>
          </div>
        </div>
      </div>
    );
  }

  const {
    status,
    username,
    avatarUrl,
    customStatus,
    activityText,
    isListeningToSpotify,
  } = statusData;

  const badges = [
    { name: 'HypeSquad', icon: 'fa-brands fa-discord', color: '#9b59b6' },
    { name: 'Active Developer', icon: 'fa-solid fa-code', color: '#fff' },
    { name: 'Verified', icon: 'fa-solid fa-circle-check', color: '#4ef04e' },
  ];

  return (
    <a
      href="https://discord.com/users/465079638088089608"
      target="_blank"
      rel="noopener noreferrer"
      className={`discord-card ${isListeningToSpotify ? 'is-spotify' : ''}`}
      id="discord-widget"
    >
      <div className="d-avatar-wrapper">
        <img id="d-avatar" src={avatarUrl} alt="Profile" />
        <div id="d-status-indicator" className={`d-status-dot ${status}`}></div>
      </div>
      <div className="d-info">
        <div className="d-header">
          <span id="d-username">{username}</span>
          <div className="d-badges" id="d-badges">
            {badges.map((b, idx) => (
              <i
                key={idx}
                className={b.icon}
                title={b.name}
                style={{ color: b.color }}
              ></i>
            ))}
          </div>
        </div>
        {customStatus && (
          <div
            id="d-custom-status"
            className="d-custom-status"
            dangerouslySetInnerHTML={{ __html: customStatus.emojiHtml + customStatus.text }}
          ></div>
        )}
        <div className="d-activity">
          <span id="d-activity-text">
            {isListeningToSpotify ? (
              <>
                <i className="fa-brands fa-spotify" style={{ marginRight: '4px' }}></i>
                {activityText}
              </>
            ) : (
              activityText
            )}
          </span>
          {isListeningToSpotify && (
            <div id="spotify-wave" className="spotify-wave">
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
            </div>
          )}
        </div>
      </div>
    </a>
  );
};
export default DiscordWidget;
