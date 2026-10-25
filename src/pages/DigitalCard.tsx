import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../context/LanguageContext';
import './DigitalCard.css';

export const DigitalCard: React.FC = () => {
  const { t, language } = useTranslation();
  const [isFlipped, setIsFlipped] = useState(false);
  const [copied, setCopied] = useState(false);

  const isTr = language === 'tr';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCardClick = () => {
    setIsFlipped((prev) => !prev);
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadVCard = (e: React.MouseEvent) => {
    e.stopPropagation();
    const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:Mustafa Kemal Göçer
N:Göçer;Mustafa Kemal;;;
TITLE:Electrical & Electronics Engineer
NICKNAME:Muskz
EMAIL;TYPE=INTERNET;TYPE=WORK:mustafakemalgocer@gmail.com
URL:https://muskz.tech
NOTE:Electrical & Electronics Engineer — Embedded Systems, PCB Design, Industrial Automation.
END:VCARD`;

    const blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Mustafa_Kemal_Gocer.vcf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="card-page">
      <header className="card-header reveal">
        <Link to="/" className="card-back-link" data-lang="back-home">
          {t('back-home')}
        </Link>
        <h1 className="card-page-title">
          {isTr ? 'Dijital Kartvizit' : 'Contact Card'}
        </h1>
      </header>

      <div className="card-layout reveal">
        <div className="card-perspective" onClick={handleCardClick}>
          <div className={`card-3d-inner ${isFlipped ? 'is-flipped' : ''}`}>
            {/* FRONT FACE */}
            <div className="card-face card-face-front">
              <div className="card-top-row">
                <div>
                  <div className="card-label-small">Electrical &amp; Electronics Engineer</div>
                  <h2 className="card-holder-name">Mustafa Kemal Göçer</h2>
                </div>

                <div className="card-logo-mark" aria-hidden="true">
                  <svg viewBox="0 0 56 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M20 4C26.6274 4 32 10.268 32 18C32 25.732 26.6274 32 20 32C13.3726 32 8 25.732 8 18C8 10.268 13.3726 4 20 4Z"
                      fill="#FFFFFF"
                      fillOpacity="0.88"
                    />
                    <path
                      d="M36 4C42.6274 4 48 10.268 48 18C48 25.732 42.6274 32 36 32C29.3726 32 24 25.732 24 18C24 10.268 29.3726 4 36 4Z"
                      fill="#E5E7EB"
                      fillOpacity="0.45"
                    />
                  </svg>
                </div>
              </div>

              <div className="card-bottom-row">
                <div>
                  <div className="card-label-small">Direct</div>
                  <div className="card-account-number">mustafakemalgocer@gmail.com</div>
                </div>

                <div>
                  <div className="card-label-small" style={{ textAlign: 'right' }}>
                    Loc
                  </div>
                  <div className="card-valid-date">TR / ADA</div>
                </div>
              </div>
            </div>

            {/* BACK FACE */}
            <div className="card-face card-face-back">
              <div className="card-back-stripe" />

              <div className="card-back-sig-bar">
                <span className="card-back-sig-url">muskz.tech</span>
                <span className="card-back-sig-cvv">EEE · R&amp;D</span>
              </div>

              <div className="card-back-info-wrap">
                <div className="card-back-name-title">
                  <div className="card-back-person-name">Mustafa Kemal Göçer</div>
                  <div className="card-back-role-text">STM32 · ESP32 · Altium · TypeScript</div>
                  <div className="card-back-email-text">github.com/mustafakemalz</div>
                </div>

                <div className="card-back-chip" />
              </div>
            </div>
          </div>
        </div>

        <div className="card-actions-ledger">
          <button type="button" className="card-ledger-row" onClick={handleDownloadVCard}>
            <span className="card-ledger-label">
              {isTr ? 'Rehbere Kaydet' : 'Save Contact'}
            </span>
            <span className="card-ledger-meta">.vcf ↓</span>
          </button>

          <button type="button" className="card-ledger-row" onClick={handleCardClick}>
            <span className="card-ledger-label">
              {isFlipped
                ? isTr
                  ? 'Ön Yüzü Göster'
                  : 'Show Front Side'
                : isTr
                ? 'Arka Yüzü Göster'
                : 'Show Back Side'}
            </span>
            <span className="card-ledger-meta">↻</span>
          </button>

          <button type="button" className="card-ledger-row" onClick={handleCopyLink}>
            <span className="card-ledger-label">
              {copied
                ? isTr
                  ? 'Bağlantı Kopyalandı'
                  : 'Link Copied'
                : isTr
                ? 'Kart Bağlantısını Kopyala'
                : 'Copy Card URL'}
            </span>
            <span className="card-ledger-meta">{copied ? '✓' : '↗'}</span>
          </button>

          <Link to="/links" className="card-ledger-row">
            <span className="card-ledger-label">
              {isTr ? 'Tüm Bağlantılar' : 'All Links'}
            </span>
            <span className="card-ledger-meta">/links →</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DigitalCard;
