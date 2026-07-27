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
        {/* --- 3D PERSPECTIVE CARD WRAPPER --- */}
        <div className="card-perspective" onClick={handleCardClick}>
          <div className={`card-3d-inner ${isFlipped ? 'is-flipped' : ''}`}>
            
            {/* ════════ FRONT FACE: MATTE BLACK CRESCENT CARD ════════ */}
            <div className="card-face card-face-front">
              {/* Crescent Rim Sphere Glow on Bottom Left */}
              <div className="card-crescent-sphere" />

              {/* TOP ROW: CARD HOLDER & LOGO MARK */}
              <div className="card-top-row">
                <div>
                  <div className="card-label-small">Card Holder</div>
                  <h1 className="card-holder-name">Mustafa Kemal</h1>
                </div>

                {/* Overlapping Hexagon Logo Mark (Matching Reference Photo) */}
                <div className="card-logo-mark">
                  <svg viewBox="0 0 56 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Left Hexagon / Oval */}
                    <path
                      d="M20 4C26.6274 4 32 10.268 32 18C32 25.732 26.6274 32 20 32C13.3726 32 8 25.732 8 18C8 10.268 13.3726 4 20 4Z"
                      fill="#FFFFFF"
                      fillOpacity="0.9"
                    />
                    {/* Right Hexagon / Oval */}
                    <path
                      d="M36 4C42.6274 4 48 10.268 48 18C48 25.732 42.6274 32 36 32C29.3726 32 24 25.732 24 18C24 10.268 29.3726 4 36 4Z"
                      fill="#E5E7EB"
                      fillOpacity="0.5"
                    />
                  </svg>
                </div>
              </div>

              {/* BOTTOM ROW: ACCOUNT NUMBER & VALID THRU */}
              <div className="card-bottom-row">
                <div>
                  <div className="card-label-small">Account Number</div>
                  <div className="card-account-number">•••• •••• •••• 0890</div>
                </div>

                <div>
                  <div className="card-label-small" style={{ textAlign: 'right' }}>Valid thru</div>
                  <div className="card-valid-date">08/28</div>
                </div>
              </div>
            </div>

            {/* ════════ BACK FACE: REAR CREDIT CARD ════════ */}
            <div className="card-face card-face-back">
              <div className="card-back-stripe" />

              <div className="card-back-sig-bar">
                <span className="card-back-sig-url">mustafakemalz.github.io/card</span>
                <span className="card-back-sig-cvv">777</span>
              </div>

              <div className="card-back-info-wrap">
                <div className="card-back-name-title">
                  <div className="card-back-person-name">Mustafa Kemal Göçer</div>
                  <div className="card-back-role-text">Streamer • Developer • Creator</div>
                  <div className="card-back-email-text">contact@muskz.dev</div>
                </div>

                <div className="card-back-chip" />
              </div>
            </div>

          </div>
        </div>

        {/* TAP HINT BADGE */}
        <div className="card-flip-hint-badge" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
          </svg>
          {isFlipped ? 'Ön Yüzü Göster 🔄' : 'Karta Dokunarak Arkasını Çevir 🔄'}
        </div>

        {/* --- MOBILE ACTION BUTTONS BELOW CARD --- */}
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
