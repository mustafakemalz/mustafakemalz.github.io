import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../context/LanguageContext';
import './Sistem.css';

interface SpecItem {
  labelKey: string;
  value: string;
  details: string;
  url?: string;
}

const coreSpecs: SpecItem[] = [
  {
    labelKey: 'spec-cpu',
    value: 'AMD Ryzen 5 7500X3D',
    details: '3D V-Cache · AM5',
    url: 'https://www.amazon.com.tr/AMD-RYZEN-7500X3D-4-0GHZ-TRAY/dp/B0GVNKPX8L/ref=sr_1_1?sr=8-1',
  },
  {
    labelKey: 'spec-gpu',
    value: 'Gigabyte Radeon RX 9060 XT',
    details: 'RDNA 4 · PCIe 5.0',
    url: 'https://www.amazon.com.tr/GIGABYTE-Radeon-GAMING-Ekran-Kart%C4%B1/dp/B0F7HTR8DQ/ref=sr_1_3?sr=8-3',
  },
  {
    labelKey: 'spec-ram',
    value: 'XPG Lancer Blade 32 GB',
    details: '2×16 GB · DDR5-6000 CL30',
    url: 'https://www.amazon.com.tr/XPG-PC5-48000-288-Pins-Masa%C3%BCst%C3%BC-AX5U6000C3016G-DTLABRBK/dp/B0CCK6P1HR/ref=sr_1_1?__mk_tr_TR=%C3%85M%C3%85%C5%BD%C3%95%C3%91&sr=8-1',
  },
  {
    labelKey: 'spec-mobo',
    value: 'MSI PRO B650M-E',
    details: 'AM5 · mATX · DDR5-6800+ · M.2 Gen4',
    url: 'https://www.amazon.com.tr/MSI-PRO-B650M-6800MHZ-USB3-2/dp/B0DTHK5YS9/ref=sr_1_2?__mk_tr_TR=%C3%85M%C3%85%C5%BD%C3%95%C3%91&sr=8-2',
  },
  {
    labelKey: 'spec-storage',
    value: 'Kingston NV3 1 TB',
    details: 'PCIe 4.0 NVMe M.2 · 6000 / 4000 MB/s',
    url: 'https://www.amazon.com.tr/Kingston-2280-NVMe-SNV3S-1000G/dp/B0DBR3DZWG/ref=sr_1_1?__mk_tr_TR=%C3%85M%C3%85%C5%BD%C3%95%C3%91&sr=8-1',
  },
  {
    labelKey: 'spec-case',
    value: 'Cougar MX220 + 650W',
    details: 'Mesh Mid-Tower · 80+ PSU · USB 3.2',
    url: 'https://www.amazon.com.tr/Cougar-CGR-2AC8B-RGB-Mid-Tower-Temperli-Gaming/dp/B0GL3JK6QF/ref=sr_1_1?__mk_tr_TR=%C3%85M%C3%85%C5%BD%C3%95%C3%91&sr=8-1',
  },
];

const peripheralSpecs: SpecItem[] = [
  {
    labelKey: 'spec-monitor1',
    value: 'Dell Alienware AW2525HM',
    details: '24.5" · 1920×1080 · 320Hz · 0.5ms Fast IPS',
    url: 'https://www.amazon.com.tr/Alienware-AW2525HM-Adaptive-Gaming-Monit%C3%B6r/dp/B0FH5NMXHK/ref=sr_1_4?__mk_tr_TR=%C3%85M%C3%85%C5%BD%C3%95%C3%91&sr=8-4',
  },
  {
    labelKey: 'spec-monitor2',
    value: 'Samsung LF24T450FQRXUF',
    details: '24" · 1920×1080 · 75Hz · IPS',
    url: 'https://www.google.com/search?q=Samsung+T450',
  },
  {
    labelKey: 'spec-keyboard',
    value: 'Wraith W60 Ciela',
    details: '60% Layout · Magnetic Switch',
    url: 'https://wraithesports.com/products/wraith-w60?variant=49637256233153',
  },
  {
    labelKey: 'spec-mouse',
    value: 'ATK VXE Mad R 8K',
    details: '8000Hz Wireless · PAW3395 · 36g',
    url: 'https://www.atk.store/products/vxe-mad-r-series-wireless-mouse?srsltid=AfmBOorHMQ3fFWkMaTD3tNLUiFmaFvO0gAqST8ppBzx7OmdhAlnDNiyg',
  },
];

export const Sistem: React.FC = () => {
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const renderSpecRow = (spec: SpecItem) => {
    const RowTag = spec.url ? 'a' : 'div';
    const rowProps = spec.url
      ? { href: spec.url, target: '_blank', rel: 'noopener noreferrer' }
      : {};

    return (
      <RowTag key={spec.labelKey} className="sistem-row" {...rowProps}>
        <span className="sistem-row-label" data-lang={spec.labelKey}>
          {t(spec.labelKey)}
        </span>
        <div className="sistem-row-main">
          <span className="sistem-row-value">{spec.value}</span>
          <span className="sistem-row-details">{spec.details}</span>
        </div>
        {spec.url && (
          <span className="sistem-row-arrow" aria-hidden="true">
            ↗
          </span>
        )}
      </RowTag>
    );
  };

  return (
    <div className="sistem-page">
      <header className="sistem-header reveal">
        <Link to="/" className="sistem-back-link" data-lang="back-home">
          {t('back-home')}
        </Link>
        <h1 className="sistem-title" data-lang="sistem-hero-title">
          {t('sistem-hero-title')}
        </h1>
        <p className="sistem-lead" data-lang="sistem-hero-desc">
          {t('sistem-hero-desc')}
        </p>
      </header>

      <figure className="sistem-figure reveal">
        <div className="sistem-photo-frame">
          <img
            src="/assets/system_setup.jpg"
            alt="Mustafa Kemal Workstation Setup"
            loading="lazy"
            decoding="async"
          />
        </div>
        <figcaption className="sistem-figcaption">
          <span>Adana, TR — Workstation &amp; Bench</span>
          <a
            href="https://kick.com/muskz"
            target="_blank"
            rel="noopener noreferrer"
            className="sistem-kick-link"
            data-lang="watch-on-kick"
          >
            {t('watch-on-kick')}
          </a>
        </figcaption>
      </figure>

      <section className="sistem-section reveal" aria-labelledby="cat-core-heading">
        <div className="section-head">
          <h2 id="cat-core-heading" className="section-title" data-lang="cat-core">
            {t('cat-core')}
          </h2>
        </div>
        <div className="sistem-ledger">{coreSpecs.map(renderSpecRow)}</div>
      </section>

      <section className="sistem-section reveal" aria-labelledby="cat-peripherals-heading">
        <div className="section-head">
          <h2 id="cat-peripherals-heading" className="section-title" data-lang="cat-peripherals">
            {t('cat-peripherals')}
          </h2>
        </div>
        <div className="sistem-ledger">{peripheralSpecs.map(renderSpecRow)}</div>
      </section>
    </div>
  );
};

export default Sistem;
