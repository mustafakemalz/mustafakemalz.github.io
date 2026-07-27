import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './DigitalCard.css';

export const DigitalCard: React.FC = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
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
TITLE:Streamer • Developer • Creator
NICKNAME:Muskz
EMAIL;TYPE=INTERNET;TYPE=WORK:contact@muskz.dev
URL:https://mustafakemalz.github.io
NOTE:Kod yazar, yayın açar, projeler üretir.
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
    <div className="card-page-container">
      <div className="card-page-wrap">
        {/* --- 3D PERSPECTIVE WRAPPER --- */}
        <div className="card-perspective" onClick={handleCardClick}>
          <div className={`card-3d-inner ${isFlipped ? 'is-flipped' : ''}`}>
            
            {/* ════════ FRONT FACE ════════ */}
            <div className="card-face card-face-front">
              <div className="card-header-row">
                <span className="card-nfc-badge">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3a9 9 0 0 0-9 9 1 1 0 1 0 2 0 7 7 0 0 1 7-7 1 1 0 1 0 0-2zm0 4a5 5 0 0 0-5 5 1 1 0 1 0 2 0 3 3 0 0 1 3-3 1 1 0 1 0 0-2zm0 4a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                  </svg>
                  NFC CARD
                </span>
                <span className="card-brand-logo">Muskz</span>
              </div>

              <div className="card-front-center">
                <img
                  src="/assets/muskz-profile.png"
                  alt="Mustafa Kemal Göçer"
                  className="card-avatar"
                />
                <h1 className="card-person-name">Mustafa Kemal Göçer</h1>
                <div className="card-person-title">Streamer • Developer • Creator</div>
                <div className="card-tag-pill">@muskz</div>
              </div>

              <div className="card-tap-hint">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
                </svg>
                Çevirmek için karta dokun 🔄
              </div>
            </div>

            {/* ════════ BACK FACE ════════ */}
            <div className="card-face card-face-back">
              <div className="card-header-row">
                <span className="card-nfc-badge" style={{ color: '#a855f7', borderColor: 'rgba(168, 85, 247, 0.4)', background: 'rgba(168, 85, 247, 0.12)' }}>
                  DETAILS
                </span>
                <span className="card-brand-logo">Muskz</span>
              </div>

              <div className="card-back-content">
                <div className="card-back-section">
                  <div className="card-back-title">Hakkımda</div>
                  <p className="card-back-text">
                    Donanım ve yazılım arasında köprüler kuruyorum. Canlı yayınlar açıyor, yazılım projeleri geliştiriyor ve dijital içerikler üretiyorum.
                  </p>
                </div>

                <div className="card-back-section">
                  <div className="card-back-title">Teknolojiler</div>
                  <div className="card-back-skills">
                    <span className="card-back-skill-pill">React</span>
                    <span className="card-back-skill-pill">TypeScript</span>
                    <span className="card-back-skill-pill">Node.js</span>
                    <span className="card-back-skill-pill">OBS / Stream</span>
                    <span className="card-back-skill-pill">Tailwind</span>
                  </div>
                </div>

                <div className="card-back-section">
                  <div className="card-back-title">İletişim</div>
                  <p className="card-back-text" style={{ fontWeight: 600 }}>
                    contact@muskz.dev
                  </p>
                </div>
              </div>

              <div className="card-tap-hint">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
                </svg>
                Ön yüze dönmek için dokun 🔄
              </div>
            </div>

          </div>
        </div>

        {/* --- ACTION BUTTONS BELOW CARD --- */}
        <div className="card-actions-grid">
          <button className="card-action-btn-primary" onClick={handleDownloadVCard}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Rehbere Kaydet (.vCard)
          </button>

          <Link to="/link" className="card-action-btn-secondary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
            Sosyal Link Hub Sayfası
          </Link>

          <button className="card-action-btn-secondary" onClick={handleCopyLink}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            {copied ? 'Link Kopyalandı! ✓' : 'Kart Linkini Kopyala'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DigitalCard;
