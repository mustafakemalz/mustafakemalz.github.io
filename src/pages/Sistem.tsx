import React, { useEffect, useState } from 'react';
import { useTranslation } from '../context/LanguageContext';
import './Sistem.css';

export const Sistem: React.FC = () => {
  const { t } = useTranslation();
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const KICK_CHANNEL_SLUG = 'muskz';
    const ALLORIGINS_PROXY = 'https://api.allorigins.win/raw?url=';
    const KICK_API_URL = `https://kick.com/api/v2/channels/${KICK_CHANNEL_SLUG}`;

    const checkStatus = async () => {
      try {
        const response = await fetch(`${ALLORIGINS_PROXY}${encodeURIComponent(KICK_API_URL)}`);
        if (!response.ok) throw new Error('Proxy error');
        const data = await response.json();
        setIsLive(data.livestream !== null);
      } catch (error) {
        console.warn('Failed to fetch Kick status:', error);
        setIsLive(false);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="system-container">
        {/* Go Back & Hero Title */}
        <div className="system-hero reveal">
          <span className="system-hero-badge" data-lang="sistem-hero-badge">
            {t('sistem-hero-badge')}
          </span>
          <h1>{t('sistem-hero-title')}</h1>
          <p className="section-text" data-lang="sistem-hero-desc">
            {t('sistem-hero-desc')}
          </p>
        </div>

        {/* Showcase Spec Grid */}
        <div className="showcase-grid">
          {/* Left Column: Kick stream visual card */}
          <a
            href="https://kick.com/muskz"
            target="_blank"
            rel="noopener noreferrer"
            className={`kick-showcase-card reveal ${isLive ? 'live-mode' : 'offline-mode'}`}
          >
            {/* Status Badge Overlay */}
            <div className="stream-badge-overlay">
              <span className="pulse-dot"></span>
              {isLive && (
                <span id="kick-status-text">
                  {t('status-online')}
                </span>
              )}
            </div>

            {/* Hover Overlay */}
            <div className="kick-hover-overlay">
              <div className="kick-logo-wrapper">
                <svg width="50" height="50" viewBox="0 0 24 24" fill="#53fc18" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 3H9V7H11V5H13V3H19V9H17V11H15V13H17V15H19V21H13V19H11V17H9V21H3V3Z"/>
                </svg>
              </div>
              <span className="hover-action-text" data-lang="watch-on-kick">
                {t('watch-on-kick')}
              </span>
            </div>

            {/* Setup Image */}
            <div className="image-wrapper">
              <img src="/assets/system_setup.jpg" alt="Mustafa Kemal Workstation Setup" />
            </div>

            {/* Caption Footer */}
            <div className="image-showcase-caption">
              <div className="kick-link-tag">
                KICK.COM/MUSKZ <i className="fa-solid fa-arrow-up-right-from-square"></i>
              </div>
            </div>
          </a>

          {/* Right Column: Specs Categories */}
          <div className="specs-wrapper">
            {/* Category: Core Components */}
            <div className="specs-category reveal">
              <div className="category-header" data-lang="cat-core">
                {t('cat-core')}
              </div>
              <div className="specs-grid">
                <div className="spec-card">
                  <div className="spec-icon">
                    <i className="fa-solid fa-microchip"></i>
                  </div>
                  <div className="spec-info">
                    <span className="spec-label" data-lang="spec-cpu">
                      {t('spec-cpu')}
                    </span>
                    <span className="spec-value">AMD Ryzen 7 7500X3D</span>
                    <span className="spec-details">Gaming & Workstation Processor</span>
                  </div>
                </div>

                <div className="spec-card">
                  <div className="spec-icon">
                    <i className="fa-solid fa-vr-cardboard"></i>
                  </div>
                  <div className="spec-info">
                    <span className="spec-label" data-lang="spec-gpu">
                      {t('spec-gpu')}
                    </span>
                    <span className="spec-value">AMD Radeon RX 9060 XT</span>
                    <span className="spec-details">High Performance Graphics Card</span>
                  </div>
                </div>

                <div className="spec-card">
                  <div className="spec-icon">
                    <i className="fa-solid fa-memory"></i>
                  </div>
                  <div className="spec-info">
                    <span className="spec-label" data-lang="spec-ram">
                      {t('spec-ram')}
                    </span>
                    <span className="spec-value">32 GB RAM</span>
                    <span className="spec-details">DDR5 High Speed Memory</span>
                  </div>
                </div>

                <div className="spec-card">
                  <div className="spec-icon">
                    <i className="fa-solid fa-folder-open"></i>
                  </div>
                  <div className="spec-info">
                    <span className="spec-label" data-lang="spec-mobo">
                      {t('spec-mobo')}
                    </span>
                    <span className="spec-value">MSI PRO B650M-E 6800MHz</span>
                    <span className="spec-details">OC M.2 AM5 mATX</span>
                  </div>
                </div>

                <div className="spec-card">
                  <div className="spec-icon">
                    <i className="fa-solid fa-hard-drive"></i>
                  </div>
                  <div className="spec-info">
                    <span className="spec-label" data-lang="spec-storage">
                      {t('spec-storage')}
                    </span>
                    <span className="spec-value">Kingston 1TB NV3 NVMe</span>
                    <span className="spec-details">Gen4 (6000MB/s Read - 4000MB/s Write)</span>
                  </div>
                </div>

                <div className="spec-card">
                  <div className="spec-icon">
                    <i className="fa-solid fa-plug"></i>
                  </div>
                  <div className="spec-info">
                    <span className="spec-label" data-lang="spec-case">
                      {t('spec-case')}
                    </span>
                    <span className="spec-value">Cougar MX220 RGB 650W</span>
                    <span className="spec-details">80+ Siyah Mesh USB 3.2 Mid Tower</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Category: Peripherals */}
            <div className="specs-category reveal">
              <div className="category-header" data-lang="cat-peripherals">
                {t('cat-peripherals')}
              </div>
              <div className="specs-grid">
                <div className="spec-card">
                  <div className="spec-icon">
                    <i className="fa-solid fa-desktop"></i>
                  </div>
                  <div className="spec-info">
                    <span className="spec-label" data-lang="spec-monitor1">
                      {t('spec-monitor1')}
                    </span>
                    <span className="spec-value">Dell Alienware AW2525HM</span>
                    <span className="spec-details">24.5" 320Hz 0.5ms Full HD</span>
                  </div>
                </div>

                <div className="spec-card">
                  <div className="spec-icon">
                    <i className="fa-solid fa-desktop"></i>
                  </div>
                  <div className="spec-info">
                    <span className="spec-label" data-lang="spec-monitor2">
                      {t('spec-monitor2')}
                    </span>
                    <span className="spec-value">Samsung T450</span>
                    <span className="spec-details">24" 75Hz 5ms FHD IPS LED</span>
                  </div>
                </div>

                <div className="spec-card">
                  <div className="spec-icon">
                    <i className="fa-solid fa-keyboard"></i>
                  </div>
                  <div className="spec-info">
                    <span className="spec-label" data-lang="spec-keyboard">
                      {t('spec-keyboard')}
                    </span>
                    <span className="spec-value">Wraith W60 Ciela</span>
                    <span className="spec-details">Mechanical Gaming Keyboard</span>
                  </div>
                </div>

                <div className="spec-card">
                  <div className="spec-icon">
                    <i className="fa-solid fa-mouse"></i>
                  </div>
                  <div className="spec-info">
                    <span className="spec-label" data-lang="spec-mouse">
                      {t('spec-mouse')}
                    </span>
                    <span className="spec-value">ATK Mad R 8K</span>
                    <span className="spec-details">Ultra Lightweight 8K Polling</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sistem;
