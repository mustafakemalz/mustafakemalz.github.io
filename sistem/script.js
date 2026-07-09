/* --- CONFIGURATION & TRANSLATIONS --- */
const translations = {
    en: {
        "back-home": "BACK",
        "sys-hero-desc": "Hardware Specs & Live Stream Status",
        "cat-core": "CORE COMPONENTS",
        "cat-peripherals": "PERIPHERALS",
        "spec-cpu": "CPU",
        "spec-gpu": "GPU",
        "spec-ram": "RAM",
        "spec-mobo": "MOTHERBOARD",
        "spec-storage": "STORAGE",
        "spec-case": "CASE & PSU",
        "spec-monitor1": "PRIMARY MONITOR",
        "spec-monitor2": "SECONDARY MONITOR",
        "spec-keyboard": "KEYBOARD",
        "spec-mouse": "MOUSE",
        "status-online": "SYSTEM ONLINE",
        "status-standby": "SYSTEM STANDBY",
        "watch-on-kick": "WATCH ON KICK.COM",
        "footer-rights": "All rights reserved."
    },
    tr: {
        "back-home": "GERİ",
        "sys-hero-desc": "Donanım Özellikleri ve Canlı Yayın Durumu",
        "cat-core": "İÇ DONANIM BİLEŞENLERİ",
        "cat-peripherals": "ÇEVRE BİRİMLERİ",
        "spec-cpu": "İŞLEMCİ (CPU)",
        "spec-gpu": "EKRAN KARTI (GPU)",
        "spec-ram": "BELLEK (RAM)",
        "spec-mobo": "ANAKART",
        "spec-storage": "DEPOLAMA",
        "spec-case": "KASA & GÜÇ KAYNAĞI",
        "spec-monitor1": "I. EKRAN",
        "spec-monitor2": "II. EKRAN",
        "spec-keyboard": "KLAVYE",
        "spec-mouse": "MOUSE",
        "status-online": "SİSTEM ONLİNE",
        "status-standby": "SİSTEM BEKLEMEDE",
        "watch-on-kick": "KICK.COM'DA İZLE",
        "footer-rights": "Tüm hakları saklıdır."
    }
};

let currentLang = localStorage.getItem('site-lang') || 'en';
let isLiveState = false; // Keep track of stream status

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. SMOOTH SCROLL (LENIS) ---
    const lenis = new Lenis();

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // --- 2. THEME PERSISTENCE & TOGGLING ---
    const themeBtn = document.getElementById('theme-btn');
    
    // Read theme from localStorage or system defaults
    const currentTheme = localStorage.getItem('site-theme') || 
                         (document.documentElement.getAttribute('data-theme') || 'dark');
    
    if (currentTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const isLight = document.documentElement.getAttribute('data-theme') === 'light';
            if (isLight) {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('site-theme', 'dark');
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('site-theme', 'light');
            }
        });
    }

    // --- 3. LANGUAGE PERSISTENCE & TOGGLING ---
    const langBtn = document.getElementById('lang-btn');
    
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
            }
        });
        
        // Specially update the dynamic stream status text based on current status
        updateStatusBadge(isLiveState);

        if (langBtn) langBtn.textContent = lang === 'en' ? 'EN / TR' : 'TR / EN';
        localStorage.setItem('site-lang', lang);
    }

    // Update copyright year
    const yearSpan = document.getElementById('year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // --- 4. KICK LIVE STREAM STATUS CHECK ---
    const KICK_CHANNEL_SLUG = 'muskz';
    const ALLORIGINS_PROXY = 'https://api.allorigins.win/raw?url=';
    const KICK_API_URL = `https://kick.com/api/v2/channels/${KICK_CHANNEL_SLUG}`;

    async function checkKickStreamStatus() {
        const card = document.querySelector('.kick-showcase-card');
        
        try {
            // Fetch via allorigins CORS proxy
            const response = await fetch(`${ALLORIGINS_PROXY}${encodeURIComponent(KICK_API_URL)}`);
            if (!response.ok) throw new Error('Proxy error');
            
            const data = await response.json();
            const isLive = data.livestream !== null;
            isLiveState = isLive;
            
            if (card) {
                if (isLive) {
                    card.classList.add('live-mode');
                    card.classList.remove('offline-mode');
                } else {
                    card.classList.add('offline-mode');
                    card.classList.remove('live-mode');
                }
            }
            
            updateStatusBadge(isLive);
            
        } catch (error) {
            console.warn('Failed to fetch Kick status, keeping offline/standby:', error);
            if (card) {
                card.classList.add('offline-mode');
                card.classList.remove('live-mode');
            }
            isLiveState = false;
            updateStatusBadge(false);
        }
    }

    function updateStatusBadge(isLive) {
        const statusTextEl = document.getElementById('kick-status-text');
        if (!statusTextEl) return;
        
        if (isLive) {
            statusTextEl.textContent = translations[currentLang]['status-online'] || 'SYSTEM ONLINE';
        } else {
            statusTextEl.textContent = translations[currentLang]['status-standby'] || 'SYSTEM STANDBY';
        }
    }

    // Check status immediately and then every 30 seconds
    checkKickStreamStatus();
    setInterval(checkKickStreamStatus, 30000);

    // --- 5. CUSTOM CURSOR FOLLOWER ---
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');

    if (cursor && follower) {
        let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
        let followerX = mouseX - 16, followerY = mouseY - 16;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        });

        function renderCursor() {
            followerX += (mouseX - 16 - followerX) * 0.12;
            followerY += (mouseY - 16 - followerY) * 0.12;

            follower.style.left = followerX + 'px';
            follower.style.top = followerY + 'px';

            requestAnimationFrame(renderCursor);
        }
        requestAnimationFrame(renderCursor);

        // Hover expansions
        const hoverables = document.querySelectorAll('a, button, .kick-showcase-card, .spec-card');
        hoverables.forEach(link => {
            link.addEventListener('mouseenter', () => {
                follower.style.transform = 'scale(1.5)';
                follower.style.background = 'rgba(83, 252, 24, 0.03)';
                follower.style.borderColor = '#53fc18'; // Highlight cursor with Kick green color
            });
            link.addEventListener('mouseleave', () => {
                follower.style.transform = 'scale(1)';
                follower.style.background = 'transparent';
                follower.style.borderColor = 'var(--accent-color)';
            });
        });
    }

    // --- 6. GLITCH TEXT EFFECT ---
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const glitchElements = document.querySelectorAll(".glitch-text");

    glitchElements.forEach(element => {
        element.onmouseover = event => {
            let iterations = 0;
            const target = event.target;
            const originalValue = target.dataset.value;

            const interval = setInterval(() => {
                target.textContent = originalValue.split("")
                    .map((letter, index) => {
                        if (index < iterations) return originalValue[index];
                        return letters[Math.floor(Math.random() * 26)];
                    })
                    .join("");

                if (iterations >= originalValue.length) clearInterval(interval);
                iterations += 1 / 3;
            }, 30);
        }
    });

    // --- 7. SCROLL REVEAL ANIMATION ---
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, revealOptions);

    document.querySelectorAll('.reveal').forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });

    // --- 8. DYNAMIC ORBS FLOATING ---
    const orb1 = document.querySelector('.orb-1');
    const orb2 = document.querySelector('.orb-2');

    let mouseXOrb = 0;
    let mouseYOrb = 0;
    let targetXOrb = 0;
    let targetYOrb = 0;

    let rawMouseX = 0;
    let rawMouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseXOrb = (e.clientX - window.innerWidth / 2) * 0.4;
        mouseYOrb = (e.clientY - window.innerHeight / 2) * 0.4;

        rawMouseX = e.clientX;
        rawMouseY = e.clientY;
    });

    let currentScale1 = 1;
    let currentScale2 = 1;

    function animateOrbs() {
        targetXOrb += (mouseXOrb - targetXOrb) * 0.05;
        targetYOrb += (mouseYOrb - targetYOrb) * 0.05;

        const scrollEffect = window.scrollY * 0.4;
        const time = Date.now() * 0.001;
        const driftX = Math.sin(time) * 30;
        const driftY = Math.cos(time * 0.5) * 30;

        if (orb1) {
            const dist1 = Math.hypot(rawMouseX - (window.innerWidth * 0.2), rawMouseY - (window.innerHeight * 0.2));
            const targetScale1 = 1 + Math.max(0, (500 - dist1) / 500) * 0.5;
            currentScale1 += (targetScale1 - currentScale1) * 0.05;
            orb1.style.transform = `translate(${targetXOrb + driftX}px, ${targetYOrb - scrollEffect + driftY}px) scale(${currentScale1})`;
        }
        if (orb2) {
            const dist2 = Math.hypot(rawMouseX - (window.innerWidth * 0.8), rawMouseY - (window.innerHeight * 0.8));
            const targetScale2 = 1 + Math.max(0, (500 - dist2) / 500) * 0.5;
            currentScale2 += (targetScale2 - currentScale2) * 0.05;
            orb2.style.transform = `translate(${-targetXOrb - driftX}px, ${-targetYOrb + scrollEffect - driftY}px) scale(${currentScale2})`;
        }

        requestAnimationFrame(animateOrbs);
    }
    animateOrbs();
});
