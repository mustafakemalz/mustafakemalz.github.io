import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../context/LanguageContext';
import './DigitalCard.css';

export const DigitalCard: React.FC = () => {
  const { t, language } = useTranslation();
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const isTr = language === 'tr';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2200);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('mustafakemalgocer@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  const handleDownloadVCard = () => {
    const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:Mustafa Kemal Göçer
N:Göçer;Mustafa Kemal;;;
ORG:Elman Otomasyon
TITLE:Electrical & Electronics Engineer
NICKNAME:Muskz
EMAIL;TYPE=INTERNET;TYPE=WORK:mustafakemalgocer@gmail.com
URL:https://muskz.tech
NOTE:Electrical & Electronics Engineer — Embedded Systems, Multilayer PCB Design, Industrial Automation.
END:VCARD`;

    const blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Mustafa_Kemal_Gocer.vcf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const specs = [
    {
      label: isTr ? 'Kurum' : 'Organization',
      value: 'Elman Otomasyon — R&D',
      href: 'https://elmantech.com/',
    },
    {
      label: isTr ? 'Disiplin' : 'Discipline',
      value: isTr
        ? 'STM32/ESP32 · Çok Katmanlı PCB · Otomasyon'
        : 'STM32/ESP32 · Multilayer PCB · Automation',
    },
    {
      label: isTr ? 'Konum' : 'Location',
      value: 'Adana, TR',
    },
    {
      label: isTr ? 'E-posta' : 'Email',
      value: 'mustafakemalgocer@gmail.com',
      href: 'mailto:mustafakemalgocer@gmail.com',
    },
    {
      label: 'GitHub',
      value: 'github.com/mustafakemalz',
      href: 'https://github.com/mustafakemalz',
    },
    {
      label: 'LinkedIn',
      value: 'in/mustafa-kemal-göçer',
      href: 'https://tr.linkedin.com/in/mustafa-kemal-g%C3%B6%C3%A7er-41409b255',
    },
    {
      label: 'Instagram',
      value: '@jpeg.muskz',
      href: 'https://www.instagram.com/jpeg.muskz/',
    },
  ];

  return (
    <div className="card-page">
      <header className="card-header reveal">
        <Link to="/" className="card-back-link" data-lang="back-home">
          {t('back-home')}
        </Link>
        <h1 className="card-page-title">Mustafa Kemal Göçer</h1>
        <p className="card-page-role" data-lang="hero-role">
          {t('hero-role')}
        </p>
      </header>

      <div className="card-layout reveal">
        <section className="card-spec-ledger" aria-label={isTr ? 'İletişim Bilgileri' : 'Contact Specifications'}>
          {specs.map((item) => (
            <div className="card-spec-row" key={item.label}>
              <span className="card-spec-label">{item.label}</span>
              {item.href ? (
                <a
                  href={item.href}
                  target={item.href.startsWith('mailto:') ? undefined : '_blank'}
                  rel={item.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                  className="card-spec-value card-spec-link"
                >
                  {item.value} ↗
                </a>
              ) : (
                <span className="card-spec-value">{item.value}</span>
              )}
            </div>
          ))}
        </section>

        <aside className="card-actions-ledger" aria-label={isTr ? 'İşlemler' : 'Actions'}>
          <button type="button" className="card-ledger-row" onClick={handleDownloadVCard}>
            <span className="card-ledger-label">
              {isTr ? 'Rehbere Kaydet (vCard)' : 'Save Contact (vCard)'}
            </span>
            <span className="card-ledger-meta">.vcf ↓</span>
          </button>

          <button type="button" className="card-ledger-row" onClick={handleCopyEmail}>
            <span className="card-ledger-label">
              {copiedEmail
                ? isTr
                  ? 'E-posta Kopyalandı'
                  : 'Email Copied'
                : isTr
                ? 'E-posta Adresini Kopyala'
                : 'Copy Email Address'}
            </span>
            <span className="card-ledger-meta">{copiedEmail ? '✓' : '⌘C'}</span>
          </button>

          <button type="button" className="card-ledger-row" onClick={handleCopyLink}>
            <span className="card-ledger-label">
              {copiedUrl
                ? isTr
                  ? 'Bağlantı Kopyalandı'
                  : 'URL Copied'
                : isTr
                ? 'Sayfa Bağlantısını Kopyala'
                : 'Copy Page URL'}
            </span>
            <span className="card-ledger-meta">{copiedUrl ? '✓' : '↗'}</span>
          </button>

          <Link to="/links" className="card-ledger-row">
            <span className="card-ledger-label">
              {isTr ? 'Tüm Bağlantılar' : 'All Directory Links'}
            </span>
            <span className="card-ledger-meta">/links →</span>
          </Link>
        </aside>
      </div>
    </div>
  );
};

export default DigitalCard;
