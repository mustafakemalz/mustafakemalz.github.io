/* --- AYARLAR --- */
const DISCORD_ID = "465079638088089608"; // Senin Gerçek ID'n

const translations = {
    en: {
        "nav-skills": "SKILLS",
        "nav-edu": "EXPERIENCE",
        "nav-projects": "PROJECTS",
        "nav-contact": "CONTACT",
        "hero-title": "ELECTRICAL & ELECTRONICS ENGINEER",
        "hero-desc": "Bridging the gap between Hardware and Software. Focused on Embedded Systems, IoT Solutions, and Industrial Automation.",
        "hero-cta": "VIEW PROJECTS",
        "tech-title": "TECHNICAL",
        "edu-title": "EXPERIENCE",
        "proj-title": "FEATURED",
        "edu-1-role": "Electrical-Electronics Engineering (B.Sc.)",
        "edu-1-desc": "Senior Year Student (4th Grade). Specialized in Circuit Design, Power Systems, and Digital Signal Processing.",
        "edu-2-role": "R&D Intern (PCB Design)",
        "edu-2-desc": "Prototype development and multilayer PCB design within the R&D department. Experience with Altium Designer.",
        "edu-3-role": "Front-end Developer",
        "edu-3-desc": "Developed user interfaces for blockchain projects like gotabit.io using modern web technologies.",
        "p1-title": "SMART HOME DASHBOARD",
        "p1-desc": "A real-time control panel for IoT devices utilizing MQTT protocol for instant communication.",
        "p2-title": "TELEMETRY SYSTEM",
        "p2-desc": "High-frequency data acquisition system designed for vehicle dynamics and sensor fusion analysis.",
        "yt-title": "LATEST",
        "gallery-title": "LIFE",
        "contact-title": "CONTACT",
        "tech-subtitle": "STACK",
        "edu-subtitle": "& EDU.",
        "proj-subtitle": "PROJECTS",
        "yt-subtitle": "STREAM",
        "gallery-subtitle": "STYLE",
        "contact-subtitle": "ME",
        "form-name": "NAME",
        "form-email": "EMAIL",
        "form-msg": "MESSAGE",
        "form-btn": "SEND MESSAGE",
        "form-success": "MESSAGE SENT. SYSTEM STANDBY.",
        "form-error": "ERROR. TRY AGAIN.",
        "footer-rights": "All rights reserved.",
        "yt-desc-title": "STREAM & CHAT",
        "yt-desc-text": "Join me while I work on open source projects, design PCBs, and discuss embedded systems engineering. Live coding sessions every week.",
        "yt-btn": "VISIT CHANNEL",
        "spotify-title": "RECENTLY",
        "spotify-subtitle": "PLAYED",
        "spotify-source": "Synced from Spotify",
        "spotify-open": "OPEN SPOTIFY",
        "spotify-ago": "ago",
        "spotify-empty": "No recent tracks found",
        "github-title": "Recent Repositories"
    },
    tr: {
        "nav-skills": "YETENEKLER",
        "nav-edu": "DENEYİM",
        "nav-projects": "PROJELER",
        "nav-contact": "İLETİŞİM",
        "hero-title": "ELEKTRİK-ELEKTRONİK MÜHENDİSİ",
        "hero-desc": "Donanım ve Yazılım arasındaki boşluğu dolduruyorum. Gömülü Sistemler, IoT ve Endüstriyel Otomasyon odaklı.",
        "hero-cta": "PROJELERİ GÖR",
        "tech-title": "TEKNİK",
        "edu-title": "DENEYİM",
        "proj-title": "ÖNE ÇIKAN",
        "edu-1-role": "Elektrik-Elektronik Mühendisliği (Lisans)",
        "edu-1-desc": "Devre Tasarımı, Güç Sistemleri ve Sinyal İşleme üzerine uzmanlaşan 4. sınıf öğrencisi.",
        "edu-2-role": "Ar-Ge Stajyeri (PCB Tasarım)",
        "edu-2-desc": "Ar-Ge departmanında prototip geliştirme, çok katmanlı PCB tasarımı ve donanım test süreçleri.",
        "edu-3-role": "Front-end Geliştirici",
        "edu-3-desc": "Blockchain ekosistemleri (gotabit.io) için modern web teknolojileri ile kullanıcı arayüzü geliştirme.",
        "p1-title": "AKILLI EV PANELİ",
        "p1-desc": "MQTT protokolü kullanarak IoT cihazları ile anlık haberleşme sağlayan gerçek zamanlı kontrol paneli.",
        "p2-title": "TELEMETRİ SİSTEMİ",
        "p2-desc": "Araç dinamiği ve sensör füzyon analizleri için tasarlanmış yüksek frekanslı veri toplama sistemi.",
        "yt-title": "SON",
        "gallery-title": "YAŞAM",
        "contact-title": "İLETİŞİM",
        "tech-subtitle": "YETKİNLİKLER",
        "edu-subtitle": "& EĞİTİM",
        "proj-subtitle": "PROJELER",
        "yt-subtitle": "YAYIN",
        "gallery-subtitle": "TARZI",
        "contact-subtitle": "KURUN",
        "form-name": "İSİM",
        "form-email": "E-POSTA",
        "form-msg": "MESAJ",
        "form-btn": "GÖNDER",
        "form-success": "MESAJ İLETİLDİ. SİSTEM BEKLEMEDE.",
        "form-error": "HATA. TEKRAR DENEYİN.",
        "footer-rights": "Tüm hakları saklıdır.",
        "yt-desc-title": "YAYIN & SOHBET",
        "yt-desc-text": "Açık kaynak projeler üzerinde çalışırken, PCB tasarlarken ve gömülü sistemler üzerine sohbet ederken bana katılın.",
        "yt-btn": "KANALA GİT",
        "spotify-title": "SON",
        "spotify-subtitle": "DİNLENENLER",
        "spotify-source": "Spotify'dan senkronize",
        "spotify-open": "SPOTİFY'I AÇ",
        "spotify-ago": "önce",
        "spotify-empty": "Son dinlenen şarkı bulunamadı",
        "github-title": "Son Repolar"
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. SMOOTH SCROLL (LENIS) ---
    const lenis = new Lenis();

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // --- SMOOTH SCROLL FOR NAV LINKS ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                lenis.scrollTo(targetEl, {
                    offset: -80,          // navbar yüksekliği kadar offset
                    duration: 1.2,        // saniye cinsinden süre
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) // expo easing
                });
            }
        });
    });

    // --- HAMBURGER MENU ---
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navRight = document.querySelector('.nav-right');

    if (hamburgerBtn && navRight) {
        hamburgerBtn.addEventListener('click', () => {
            hamburgerBtn.classList.toggle('active');
            navRight.classList.toggle('open');
        });

        // Close menu when a nav link is clicked
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                hamburgerBtn.classList.remove('active');
                navRight.classList.remove('open');
            });
        });

        // Close menu on scroll
        window.addEventListener('scroll', () => {
            if (navRight.classList.contains('open')) {
                hamburgerBtn.classList.remove('active');
                navRight.classList.remove('open');
            }
        });
    }

    // --- 2. 3D TILT EFFECT ---
    setupTilt();

    // --- 3. MAGNETIC BUTTONS ---
    setupMagnetic();

    // --- EXISTING CODE ---
    // --- EXISTING CODE ---

    // --- 1. DİL AYARLARI ---
    const yearSpan = document.getElementById('year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    const langBtn = document.getElementById('lang-btn');
    let currentLang = localStorage.getItem('site-lang') || 'en';
    updateLanguage(currentLang);

    if (langBtn) {
        langBtn.addEventListener('click', () => {
            currentLang = currentLang === 'en' ? 'tr' : 'en';
            updateLanguage(currentLang);
        });
    }

    function updateLanguage(lang) {
        document.querySelectorAll('[data-lang]').forEach(el => {
            const key = el.getAttribute('data-lang');
            if (translations[lang] && translations[lang][key]) {
                el.textContent = translations[lang][key];
            } else if (translations['en'] && translations['en'][key]) {
                el.textContent = translations['en'][key];
            }
        });
        if (langBtn) langBtn.textContent = lang === 'en' ? 'EN / TR' : 'TR / EN';
        localStorage.setItem('site-lang', lang);
    }

    // --- 2. DISCORD WIDGET (OTOMATİK ÇALIŞTIRMA) ---
    async function updateDiscordStatus() {
        try {
            const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
            const data = await response.json();

            if (!data.success || !data.data) return;

            const discordData = data.data;

            const avatar = document.getElementById('d-avatar');
            const statusDot = document.getElementById('d-status-indicator');
            const username = document.getElementById('d-username');
            const activityText = document.getElementById('d-activity-text');
            const spotifyWave = document.getElementById('spotify-wave');
            const card = document.getElementById('discord-widget');
            const customStatusEl = document.getElementById('d-custom-status');
            const badgesEl = document.getElementById('d-badges');

            // Avatar Güncelle (GIF Desteği ile)
            if (discordData.discord_user.avatar && avatar) {
                const extension = discordData.discord_user.avatar.startsWith("a_") ? "gif" : "png";
                avatar.src = `https://cdn.discordapp.com/avatars/${DISCORD_ID}/${discordData.discord_user.avatar}.${extension}`;
            }

            // Kullanıcı Adı Güncelle
            if (username) username.textContent = discordData.discord_user.username;

            // --- BADGES (Manuel/Yarı-Otomatik) ---
            if (badgesEl) {
                badgesEl.innerHTML = '';
                // FontAwesome İkonları Kullanıyoruz (Resimler kırık çıkmasın diye)
                const badges = [
                    { name: "HypeSquad", icon: "fa-brands fa-discord", color: "#9b59b6" }, // Mor
                    { name: "Active Developer", icon: "fa-solid fa-code", color: "#fff" },
                    { name: "Verified", icon: "fa-solid fa-circle-check", color: "#4ef04e" }
                ];

                badges.forEach(badge => {
                    const i = document.createElement('i');
                    i.className = badge.icon;
                    i.title = badge.name;
                    if (badge.color) i.style.color = badge.color;
                    badgesEl.appendChild(i);
                });
            }

            // Durum Noktası Rengi
            if (statusDot) statusDot.className = `d-status-dot ${discordData.discord_status}`;

            // --- CUSTOM STATUS (Özel Durum) ---
            const customStatus = discordData.activities.find(act => act.type === 4);
            if (customStatus && customStatus.state && customStatusEl) {
                let statusHtml = "";
                if (customStatus.emoji) {
                    // Emoji resmi veya karakteri
                    if (customStatus.emoji.id) {
                        statusHtml += `<img src="https://cdn.discordapp.com/emojis/${customStatus.emoji.id}.png?v=1" style="height: 14px; width: auto; vertical-align: middle; margin-right: 4px;">`;
                    } else {
                        statusHtml += `${customStatus.emoji.name} `;
                    }
                }
                statusHtml += customStatus.state;

                customStatusEl.innerHTML = statusHtml;
                customStatusEl.classList.remove('hidden');
            } else if (customStatusEl) {
                customStatusEl.classList.add('hidden');
            }

            // Aktivite Mantığı (Playing/Listening)
            if (!activityText) return;

            if (discordData.listening_to_spotify && discordData.spotify && discordData.spotify.song) {
                const song = discordData.spotify.song;
                const cleanSong = song.length > 25 ? song.substring(0, 25) + "..." : song;
                activityText.innerHTML = `<i class="fa-brands fa-spotify"></i> ${cleanSong}`;
                activityText.style.color = "#1DB954";
                if (spotifyWave) spotifyWave.classList.remove('hidden');
                if (card) card.style.borderColor = "rgba(29, 185, 84, 0.5)";
            }
            else if (discordData.activities.length > 0) {
                const activity = discordData.activities.find(act => act.type !== 4);

                if (activity) {
                    let text = activity.name;
                    if (activity.name === "Visual Studio Code" && activity.details) {
                        text = activity.details; // "Editing style.css" yazar
                    } else if (activity.details) {
                        text = `${activity.name} • ${activity.details}`;
                    }
                    else if (activity.state) {
                        text = `${activity.name} • ${activity.state}`;
                    }

                    activityText.textContent = text;
                    activityText.style.color = "#fff";
                    if (spotifyWave) spotifyWave.classList.add('hidden');
                    if (card) card.style.borderColor = "rgba(255, 255, 255, 0.3)";
                } else {
                    activityText.textContent = "Chilling / Online";
                    activityText.style.color = "var(--sub-text)";
                    if (card) card.style.borderColor = "rgba(255, 255, 255, 0.1)";
                    if (spotifyWave) spotifyWave.classList.add('hidden');
                }
            }
            else {
                activityText.textContent = discordData.discord_status === 'offline' ? "Offline" : "Chilling";
                activityText.style.color = "var(--sub-text)";
                if (spotifyWave) spotifyWave.classList.add('hidden');
                if (card) card.style.borderColor = "rgba(255, 255, 255, 0.1)";
            }

        } catch (e) {
            console.error("Discord widget error:", e);
        }
    }

    // Sayfa açılır açılmaz çalıştır
    updateDiscordStatus();
    // Her 5 saniyede bir güncelle (EKSİK OLAN KISIM BU OLABİLİR)
    setInterval(updateDiscordStatus, 5000);


    // --- 3. DİĞER EFEKTLER ---
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');

    if (cursor && follower) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            setTimeout(() => {
                follower.style.left = e.clientX - 16 + 'px';
                follower.style.top = e.clientY - 16 + 'px';
            }, 50);
        });

        const links = document.querySelectorAll('a, button, .tech-card, .project-card, .submit-btn, .gallery-item');
        links.forEach(link => {
            link.addEventListener('mouseenter', () => {
                follower.style.transform = 'scale(1.5)';
                follower.style.background = 'rgba(210, 255, 0, 0.1)';
            });
            link.addEventListener('mouseleave', () => {
                follower.style.transform = 'scale(1)';
                follower.style.background = 'transparent';
            });
        });
    }

    // Hacker Text Effect
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const glitchElements = document.querySelectorAll(".glitch-text"); // Değişiklik burada

    glitchElements.forEach(element => {
        element.onmouseover = event => {
            let iterations = 0;
            const target = event.target;
            // Orijinal değeri korumak için data-value'yu kullanıyoruz

            const interval = setInterval(() => {
                target.textContent = target.dataset.value.split("")
                    .map((letter, index) => {
                        if (index < iterations) return target.dataset.value[index];
                        return letters[Math.floor(Math.random() * 26)];
                    })
                    .join("");

                if (iterations >= target.dataset.value.length) clearInterval(interval);
                iterations += 1 / 3;
            }, 30);
        }
    });

    // Scroll Reveal
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.tech-card, .project-card, .youtube-section, .hero, .contact-section, .gallery-item, .timeline-item, .spotify-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        observer.observe(el);
    });

    // Form Gönderimi
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');
    if (form) {
        form.addEventListener("submit", async function (event) {
            event.preventDefault();
            const data = new FormData(event.target);
            const btnText = document.querySelector('#form-btn span');
            const originalText = btnText ? btnText.textContent : "SEND";

            if (btnText) btnText.textContent = "SENDING...";

            try {
                const response = await fetch(event.target.action, {
                    method: form.method,
                    body: data,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    if (status) {
                        status.textContent = translations[currentLang]["form-success"] || "Message sent successfully!";
                        status.style.color = "var(--accent-color)";
                    }
                    form.reset();
                    if (btnText) btnText.textContent = originalText;
                } else { throw new Error(); }
            } catch {
                if (status) {
                    status.textContent = translations[currentLang]["form-error"] || "Error sending message. Please try again.";
                    status.style.color = "#ff4444";
                }
                if (btnText) btnText.textContent = originalText;
            }
        });
    }

    // Preloader Logic
    const loaderText = document.getElementById('loader-text');
    const preloader = document.getElementById('preloader');

    if (preloader) {
        document.body.classList.add('loading-active');
        const messages = [
            "> INITIALIZING SYSTEM...",
            "> LOADING MODULES...",
            "> ESTABLISHING CONNECTION...",
            "> ACCESS GRANTED"
        ];
        let step = 0;
        const textInterval = setInterval(() => {
            if (step < messages.length && loaderText) {
                loaderText.textContent = messages[step];
                step++;
            } else {
                clearInterval(textInterval);
            }
        }, 600);

        setTimeout(() => {
            preloader.classList.add('loaded');
            document.body.classList.remove('loading-active');
            setTimeout(() => { preloader.style.display = 'none'; }, 500);
        }, 2800);
    }


    // Scroll Reveal Animation
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, revealOptions);

    document.querySelectorAll('section, .tech-card, .project-card, .gallery-item, .spotify-card').forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });

    // --- SPOTIFY RECENTLY PLAYED FETCH ---
    // Vercel API URL'ini buraya yaz (deploy edince Vercel domain'in olacak)
    const SPOTIFY_API_URL = 'https://mustafakemalz-spotify-api.vercel.app/api/spotify';

    async function fetchSpotifyTracks() {
        const container = document.getElementById('spotify-tracks');
        if (!container) return;

        try {
            const response = await fetch(SPOTIFY_API_URL);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();

            if (!data.tracks || data.tracks.length === 0) {
                container.innerHTML = `
                    <div class="spotify-empty">
                        <i class="fa-brands fa-spotify"></i>
                        <span>${translations[currentLang]['spotify-empty'] || 'No recent tracks found'}</span>
                    </div>`;
                return;
            }

            // Build compact track rows
            container.innerHTML = data.tracks.map(track => {
                return `
                    <a href="${track.url}" target="_blank" rel="noopener noreferrer" class="spotify-row">
                        <div class="spotify-row-art">
                            <img src="${track.albumArtSmall || track.albumArt}" alt="${track.album}" loading="lazy">
                        </div>
                        <div class="spotify-row-info">
                            <div class="spotify-row-name">${track.name}</div>
                            <div class="spotify-row-artist">${track.artist}</div>
                        </div>
                    </a>`;
            }).join('');

            // Re-observe new rows for scroll reveal
            container.querySelectorAll('.spotify-row').forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
                observer.observe(el);
            });

        } catch (error) {
            console.warn('Spotify fetch error:', error.message);
            // Hata durumunda skeleton'ları kaldır, güzel bir fallback göster
            if (container) {
                container.innerHTML = `
                    <div class="spotify-empty">
                        <i class="fa-brands fa-spotify"></i>
                        <span>${translations[currentLang]['spotify-empty'] || 'Could not load tracks'}</span>
                    </div>`;
            }
        }
    }

    // Utility: Time ago formatter
    function getTimeAgo(dateString) {
        const now = new Date();
        const played = new Date(dateString);
        const diffMs = now - played;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        const ago = translations[currentLang]?.['spotify-ago'] || 'ago';

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ${ago}`;
        if (diffHours < 24) return `${diffHours}h ${ago}`;
        return `${diffDays}d ${ago}`;
    }

    // Utility: Format milliseconds to mm:ss
    function formatDuration(ms) {
        const mins = Math.floor(ms / 60000);
        const secs = Math.floor((ms % 60000) / 1000);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // --- SPOTIFY ÇAĞRISI (fonksiyon tanımlandıktan sonra) ---
    fetchSpotifyTracks();

    // --- GITHUB REPOS ÇAĞRISI ---
    async function fetchGithubRepos() {
        const container = document.getElementById('github-repos');
        if (!container) return;

        try {
            const response = await fetch('https://api.github.com/users/mustafakemalz/repos?sort=updated&per_page=4');
            if (!response.ok) throw new Error('GitHub API Error');

            const repos = await response.json();

            if (!repos || repos.length === 0) {
                container.innerHTML = `
                    <div class="spotify-empty">
                        <i class="fa-brands fa-github"></i>
                        <span>No public repos found</span>
                    </div>`;
                return;
            }

            container.innerHTML = repos.map(repo => {
                const isFork = repo.fork ? ' (Fork)' : '';
                return `
                    <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="github-row">
                        <div class="github-row-icon">
                            <i class="fa-solid fa-code-branch"></i>
                        </div>
                        <div class="github-row-info">
                            <div class="github-row-name">${repo.name}${isFork}</div>
                            <div class="github-row-desc">${repo.description || 'No description provided'}</div>
                        </div>
                    </a>`;
            }).join('');

            // Scroll reveal animation for github rows
            container.querySelectorAll('.github-row').forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
                observer.observe(el);
            });

        } catch (error) {
            console.warn('GitHub fetch error:', error.message);
            if (container) {
                container.innerHTML = `
                    <div class="spotify-empty">
                        <i class="fa-brands fa-github"></i>
                        <span>Failed to load repositories</span>
                    </div>`;
            }
        }
    }

    fetchGithubRepos();
});


/* --- DİNAMİK ARKA PLAN (PARALLAX & MOUSE) --- */
const orb1 = document.querySelector('.orb-1');
const orb2 = document.querySelector('.orb-2');

let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

// Mouse pozisyonunu takip et
let rawMouseX = 0;
let rawMouseY = 0;

document.addEventListener('mousemove', (e) => {
    // Parallax için
    mouseX = (e.clientX - window.innerWidth / 2) * 0.4;
    mouseY = (e.clientY - window.innerHeight / 2) * 0.4;

    // Proximity (Yakınlık) hesabı için ham koordinatlar
    rawMouseX = e.clientX;
    rawMouseY = e.clientY;
});

// Animation Loop (Lerp - Linear Interpolation)
// Animation Loop (Lerp - Linear Interpolation)
let currentScale1 = 1;
let currentScale2 = 1;

function animateOrbs() {
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    // Scroll Effect
    const scrollEffect = window.scrollY * 0.4;

    // Auto Drift (Time-based movement when idle)
    const time = Date.now() * 0.001;
    // X axis: Slight horizontal sway
    const driftX = Math.sin(time) * 30;
    // Y axis: Gentle Bobbing
    const driftY = Math.cos(time * 0.5) * 30;

    // Original Parallax Logic
    if (orb1) {
        // Proximity for Scaling
        const dist1 = Math.hypot(rawMouseX - (window.innerWidth * 0.2), rawMouseY - (window.innerHeight * 0.2));
        const targetScale1 = 1 + Math.max(0, (500 - dist1) / 500) * 0.5;

        // Smooth Scaling
        currentScale1 += (targetScale1 - currentScale1) * 0.05;

        // Move relative to CSS position + Parallax + Drift
        orb1.style.transform = `translate(${targetX + driftX}px, ${targetY - scrollEffect + driftY}px) scale(${currentScale1})`;
    }
    if (orb2) {
        const dist2 = Math.hypot(rawMouseX - (window.innerWidth * 0.8), rawMouseY - (window.innerHeight * 0.8));
        const targetScale2 = 1 + Math.max(0, (500 - dist2) / 500) * 0.5;

        currentScale2 += (targetScale2 - currentScale2) * 0.05;

        // Move relative to CSS position + Parallax (Inverted) + Drift
        orb2.style.transform = `translate(${-targetX - driftX}px, ${-targetY + scrollEffect - driftY}px) scale(${currentScale2})`;
    }

    requestAnimationFrame(animateOrbs);
}

animateOrbs();


/* --- FOOTER GÖRÜNÜNCE SOL MENÜYÜ GİZLE + SMART NAVBAR --- */


window.addEventListener('scroll', () => {
    const footer = document.querySelector('footer');
    const sidebar = document.querySelector('.sticky-left');
    const discordCard = document.querySelector('.discord-card');
    const nav = document.querySelector('nav');

    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    // --- NAVBAR SHRINK ON SCROLL ---
    if (nav) {
        if (currentScroll > 80) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }

    // --- SIDEBAR HIDE LOGIC ---
    if (footer) {
        const footerPosition = footer.getBoundingClientRect().top;
        const screenPosition = window.innerHeight;

        if (footerPosition < screenPosition) {
            if (sidebar) sidebar.classList.add('hide-sidebar');

            // Discord Widget: Lift UP above footer instead of hiding
            if (discordCard) {
                const overlap = screenPosition - footerPosition;
                // Lift safely above footer content + 20px padding
                // Use default 20px bottom + overlap
                discordCard.style.transform = `translateY(-${overlap + 20}px)`;
            }
        } else {
            if (sidebar) sidebar.classList.remove('hide-sidebar');
            if (discordCard) discordCard.style.transform = 'translateY(0)'; // Reset position
        }
    }
});

// --- 3D TILT & GLARE LOGIC ---
function setupTilt() {
    const cards = document.querySelectorAll('.project-card');

    cards.forEach(card => {


        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calculate Rotation (Max 10deg)
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10; // Invert Y for correct feel
            const rotateY = ((x - centerX) / centerX) * 10;

            // Apply Transform
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;


        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';

        });
    });
}

// --- MAGNETIC BUTTONS LOGIC ---
function setupMagnetic() {
    const magnets = document.querySelectorAll('.nav-links a, .control-btn, .social-icon');

    magnets.forEach(magnet => {
        magnet.addEventListener('mousemove', (e) => {
            const rect = magnet.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Magnetic Pull Strength (Divide by 5 for ease)
            magnet.style.transform = `translate(${x / 3}px, ${y / 3}px)`;
        });

        magnet.addEventListener('mouseleave', () => {
            magnet.style.transform = 'translate(0, 0)';
        });
    });
}