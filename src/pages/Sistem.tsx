import React, { useEffect, useState } from 'react';
import { useTranslation } from '../context/LanguageContext';
import './Sistem.css';

interface SpecItem {
  icon: string;
  labelKey: string;
  value: string;
  details: string;
  url?: string;
}

const coreSpecs: SpecItem[] = [
  {
    icon: 'fa-solid fa-microchip',
    labelKey: 'spec-cpu',
    value: 'AMD Ryzen 7 7500X3D',
    details: 'Gaming & Workstation Processor',
    url: 'https://www.amazon.com.tr/AMD-RYZEN-7500X3D-4-0GHZ-TRAY/dp/B0GVNKPX8L/ref=sr_1_1?sr=8-1'
  },
  {
    icon: 'fa-solid fa-vr-cardboard',
    labelKey: 'spec-gpu',
    value: 'AMD Radeon RX 9060 XT',
    details: 'High Performance Graphics Card',
    url: 'https://www.amazon.com.tr/GIGABYTE-Radeon-GAMING-Ekran-Kart%C4%B1/dp/B0F7HTR8DQ/ref=sr_1_3?sr=8-3'
  },
  {
    icon: 'fa-solid fa-memory',
    labelKey: 'spec-ram',
    value: '32 GB RAM',
    details: 'DDR5 High Speed Memory',
    url: 'https://www.amazon.com.tr/XPG-PC5-48000-288-Pins-Masa%C3%BCst%C3%BC-AX5U6000C3016G-DTLABRBK/dp/B0CCK6P1HR/ref=sr_1_1?__mk_tr_TR=%C3%85M%C3%85%C5%BD%C3%95%C3%91&sr=8-1'
  },
  {
    icon: 'fa-solid fa-folder-open',
    labelKey: 'spec-mobo',
    value: 'MSI PRO B650M-E 6800MHz',
    details: 'OC M.2 AM5 mATX',
    url: 'https://www.amazon.com.tr/MSI-PRO-B650M-6800MHZ-USB3-2/dp/B0DTHK5YS9/ref=sr_1_2?__mk_tr_TR=%C3%85M%C3%85%C5%BD%C3%95%C3%91&sr=8-2'
  },
  {
    icon: 'fa-solid fa-hard-drive',
    labelKey: 'spec-storage',
    value: 'Kingston 1TB NV3 NVMe',
    details: 'Gen4 (6000MB/s Read - 4000MB/s Write)',
    url: 'https://www.amazon.com.tr/Kingston-2280-NVMe-SNV3S-1000G/dp/B0DBR3DZWG/ref=sr_1_1?__mk_tr_TR=%C3%85M%C3%85%C5%BD%C3%95%C3%91&sr=8-1'
  },
  {
    icon: 'fa-solid fa-plug',
    labelKey: 'spec-case',
    value: 'Cougar MX220 RGB 650W',
    details: '80+ Siyah Mesh USB 3.2 Mid Tower',
    url: 'https://www.amazon.com.tr/Cougar-CGR-2AC8B-RGB-Mid-Tower-Temperli-Gaming/dp/B0GL3JK6QF/ref=sr_1_1?__mk_tr_TR=%C3%85M%C3%85%C5%BD%C3%95%C3%91&sr=8-1'
  }
];

const peripheralSpecs: SpecItem[] = [
  {
    icon: 'fa-solid fa-desktop',
    labelKey: 'spec-monitor1',
    value: 'Dell Alienware AW2525HM',
    details: '24.5" 320Hz 0.5ms Full HD',
    url: 'https://www.amazon.com.tr/Alienware-AW2525HM-Adaptive-Gaming-Monit%C3%B6r/dp/B0FH5NMXHK/ref=sr_1_4?__mk_tr_TR=%C3%85M%C3%85%C5%BD%C3%95%C3%91&sr=8-4'
  },
  {
    icon: 'fa-solid fa-desktop',
    labelKey: 'spec-monitor2',
    value: 'Samsung T450',
    details: '24" 75Hz 5ms FHD IPS LED',
    url: 'https://www.google.com/search?q=Samsung+T450'
  },
  {
    icon: 'fa-solid fa-keyboard',
    labelKey: 'spec-keyboard',
    value: 'Wraith W60 Ciela',
    details: 'Mechanical Gaming Keyboard',
    url: 'https://wraithesports.com/products/wraith-w60?variant=49637256233153'
  },
  {
    icon: 'fa-solid fa-mouse',
    labelKey: 'spec-mouse',
    value: 'ATK Mad R 8K',
    details: 'Ultra Lightweight 8K Polling',
    url: 'https://www.atk.store/products/vxe-mad-r-series-wireless-mouse?srsltid=AfmBOorHMQ3fFWkMaTD3tNLUiFmaFvO0gAqST8ppBzx7OmdhAlnDNiyg'
  }
];

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

  const renderSpecCard = (spec: SpecItem) => {
    const CardTag = spec.url ? 'a' : 'div';
    const cardProps = spec.url
      ? { href: spec.url, target: '_blank', rel: 'noopener noreferrer' }
      : {};

    return (
      <CardTag key={spec.labelKey} className="spec-card" {...cardProps}>
        <div className="spec-icon">
          <i className={spec.icon}></i>
        </div>
        <div className="spec-info">
          <span className="spec-label" data-lang={spec.labelKey}>
            {t(spec.labelKey)}
          </span>
          <span className="spec-value">{spec.value}</span>
          <span className="spec-details">{spec.details}</span>
        </div>
        {spec.url && (
          <i className="fa-solid fa-arrow-up-right-from-square spec-external-icon"></i>
        )}
      </CardTag>
    );
  };

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
            {/* Hover Overlay */}
            <div className="kick-hover-overlay">
              <div className="kick-logo-wrapper">
                <svg width="50" height="50" viewBox="0 0 24 24" fill="#53fc18" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 3H9V7H11V5H13V3H19V9H17V11H15V13H17V15H19V21H13V19H11V17H9V21H3V3Z" />
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
                {coreSpecs.map(renderSpecCard)}
              </div>
            </div>

            {/* Category: Peripherals */}
            <div className="specs-category reveal">
              <div className="category-header" data-lang="cat-peripherals">
                {t('cat-peripherals')}
              </div>
              <div className="specs-grid">
                {peripheralSpecs.map(renderSpecCard)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sistem;
