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
        "form-name": "NAME",
        "form-email": "EMAIL",
        "form-msg": "MESSAGE",
        "form-btn": "SEND MESSAGE",
        "form-success": "MESSAGE SENT. SYSTEM STANDBY.",
        "form-error": "ERROR. TRY AGAIN.",
        "footer-rights": "All rights reserved."
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
        "form-name": "İSİM",
        "form-email": "E-POSTA",
        "form-msg": "MESAJ",
        "form-btn": "GÖNDER",
        "form-success": "MESAJ İLETİLDİ. SİSTEM BEKLEMEDE.",
        "form-error": "HATA. TEKRAR DENEYİN.",
        "footer-rights": "Tüm hakları saklıdır."
    }
};

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. TEMA & DİL AYARLARI ---
    const yearSpan = document.getElementById('year');
    if(yearSpan) yearSpan.textContent = new Date().getFullYear();
    
    const themeBtn = document.getElementById('theme-btn');
    let currentTheme = localStorage.getItem('site-theme') || 'dark';
    setTheme(currentTheme);

    if(themeBtn) {
        themeBtn.addEventListener('click', () => {
            currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(currentTheme);
        });
    }

    const langBtn = document.getElementById('lang-btn');
    let currentLang = localStorage.getItem('site-lang') || 'en';
    updateLanguage(currentLang);

    if(langBtn) {
        langBtn.addEventListener('click', () => {
            currentLang = currentLang === 'en' ? 'tr' : 'en';
            updateLanguage(currentLang);
        });
    }

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('site-theme', theme);
        if(themeBtn) themeBtn.textContent = theme === 'dark' ? '☀ LIGHT' : '☾ DARK';
    }

    function updateLanguage(lang) {
        document.querySelectorAll('[data-lang]').forEach(el => {
            const key = el.getAttribute('data-lang');
            if (translations[lang][key]) el.innerHTML = translations[lang][key]; 
        });
        if(langBtn) langBtn.textContent = lang === 'en' ? 'EN / TR' : 'TR / EN';
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

            // Avatar Güncelle (GIF Desteği ile)
            if (discordData.discord_user.avatar && avatar) {
                const extension = discordData.discord_user.avatar.startsWith("a_") ? "gif" : "png";
                avatar.src = `https://cdn.discordapp.com/avatars/${DISCORD_ID}/${discordData.discord_user.avatar}.${extension}`;
            }
            
            // Kullanıcı Adı Güncelle
            if(username) username.textContent = discordData.discord_user.username;

            // Durum Noktası Rengi
            if(statusDot) statusDot.className = `d-status-dot ${discordData.discord_status}`;

            // Aktivite Mantığı
            if(!activityText) return;

            if (discordData.listening_to_spotify) {
                const song = discordData.spotify.song;
                const cleanSong = song.length > 25 ? song.substring(0, 25) + "..." : song;
                activityText.innerHTML = `<i class="fa-brands fa-spotify"></i> ${cleanSong}`;
                activityText.style.color = "#1DB954";
                if(spotifyWave) spotifyWave.classList.remove('hidden');
                if(card) card.style.borderColor = "rgba(29, 185, 84, 0.5)"; 
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
                    if(spotifyWave) spotifyWave.classList.add('hidden');
                    if(card) card.style.borderColor = "rgba(255, 255, 255, 0.3)";
                } else {
                    activityText.textContent = "Chilling / Online";
                    activityText.style.color = "var(--sub-text)";
                    if(card) card.style.borderColor = "rgba(255, 255, 255, 0.1)";
                    if(spotifyWave) spotifyWave.classList.add('hidden');
                }
            } 
            else {
                activityText.textContent = discordData.discord_status === 'offline' ? "Offline" : "Chilling";
                activityText.style.color = "var(--sub-text)";
                if(spotifyWave) spotifyWave.classList.add('hidden');
                if(card) card.style.borderColor = "rgba(255, 255, 255, 0.1)";
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
    
    if(cursor && follower) {
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
    const h1 = document.querySelector(".glitch-text");
    if(h1) {
        h1.onmouseover = event => {
            let iterations = 0;
            const interval = setInterval(() => {
                event.target.childNodes[0].nodeValue = event.target.dataset.value.split("")
                    .map((letter, index) => {
                        if(index < iterations) return event.target.dataset.value[index];
                        return letters[Math.floor(Math.random() * 26)];
                    })
                    .join("");
                if(iterations >= event.target.dataset.value.length) clearInterval(interval);
                iterations += 1 / 3;
            }, 30);
        }
    }

    // Scroll Reveal
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { 
            if (entry.isIntersecting) { 
                entry.target.style.opacity = '1'; 
                entry.target.style.transform = 'translateY(0)'; 
            } 
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.tech-card, .project-card, .youtube-section, .hero, .contact-section, .gallery-item, .timeline-item').forEach(el => {
        el.style.opacity = '0'; 
        el.style.transform = 'translateY(30px)'; 
        el.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)'; 
        observer.observe(el);
    });

    // Form Gönderimi
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');
    if (form) {
        form.addEventListener("submit", async function(event) {
            event.preventDefault();
            const data = new FormData(event.target);
            const btnText = document.querySelector('#form-btn span');
            const originalText = btnText ? btnText.textContent : "SEND";
            
            if(btnText) btnText.textContent = "SENDING..."; 
            
            try {
                const response = await fetch(event.target.action, { 
                    method: form.method, 
                    body: data, 
                    headers: { 'Accept': 'application/json' } 
                });
                
                if (response.ok) {
                    status.innerHTML = translations[currentLang]["form-success"];
                    form.reset();
                    if(btnText) btnText.textContent = originalText;
                    status.style.color = "var(--accent-color)";
                } else { throw new Error(); }
            } catch {
                status.innerHTML = translations[currentLang]["form-error"];
                if(btnText) btnText.textContent = originalText;
                status.style.color = "#ff4444";
            }
        });
    }

    // Preloader Logic
    const loaderText = document.getElementById('loader-text');
    const preloader = document.getElementById('preloader');
    
    if(preloader) {
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
                loaderText.innerText = messages[step];
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
});

/* --- FOOTER GÖRÜNÜNCE SOL MENÜYÜ GİZLE VE WIDGET'I YUKARI KAYDIR --- */
window.addEventListener('scroll', () => {
    const footer = document.querySelector('footer');
    const sidebar = document.querySelector('.sticky-left');
    const discordWidget = document.getElementById('discord-widget');

    if (footer) {
        const footerPosition = footer.getBoundingClientRect().top;
        const screenPosition = window.innerHeight;

        // Footer görünmeye başladığında (100px tolerans ile)
        if (footerPosition < screenPosition - 100) {
            if (sidebar) sidebar.classList.add('hide-sidebar');
            // Widget'ı 140px yukarı kaldır (Daha estetik boşluk için)
            if (discordWidget) discordWidget.style.bottom = "140px"; 

        } else {
            // Footer görünmüyorsa
            if (sidebar) sidebar.classList.remove('hide-sidebar');
            // Widget'ı eski yerine (30px) geri getir
            if (discordWidget) discordWidget.style.bottom = "30px";
        }
    }
});