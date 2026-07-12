import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'tr';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    "hero-greeting": "Hey, I'm Mustafa Kemal.",
    "hero-title": "Electrical & Electronics Engineer",
    "hero-slogan": "Building bridges between hardware and software.",
    "status-text": "Available for projects",
    "tldr-text": "Mustafa Kemal is an Electrical & Electronics Engineering student at Çukurova University, specializing in Embedded Systems, IoT, and Industrial Automation. With hands-on experience in PCB design, front-end development, and open-source projects, he bridges the gap between hardware and software.",
    "about-title": "About Me",
    "about-text": "A senior Electrical & Electronics Engineering student at Çukurova University, passionate about building things that work — from circuit boards to web applications. I enjoy working across the full spectrum: designing PCBs, programming microcontrollers, building IoT solutions, and developing modern web interfaces.",
    "badge-1": "4th Year Student",
    "badge-2": "5+ Projects",
    "badge-3": "Embedded Focus",
    "stat-years": "Years of Experience",
    "stat-projects": "Projects Shipped",
    "stat-tech": "Technologies",
    "skill-cat-1": "Embedded & Control",
    "skill-cat-2": "Software & Web",
    "nav-about": "About",
    "nav-skills": "Skills",
    "nav-experience": "Experience",
    "nav-projects": "Projects",
    "nav-journey": "Journey",
    "nav-stream": "Stream",
    "nav-contact": "Contact",
    "expertise-title": "Core Expertise",
    "exp-1": "Embedded Systems & Microcontroller Programming (STM32, Arduino, ESP32)",
    "exp-2": "PCB Design & Prototyping (Altium Designer)",
    "exp-3": "IoT Solutions & Industrial Automation",
    "exp-4": "Full-Stack Web Development (React, Next.js, Node.js)",
    "exp-5": "Circuit Design & Power Systems Analysis",
    "services-title": "What I Do",
    "services-text": "From embedded hardware to web interfaces — I create end-to-end solutions bridging the physical and digital worlds.",
    "svc-1": "Embedded Systems",
    "svc-2": "IoT Solutions",
    "svc-3": "PCB Design",
    "svc-4": "Web Development",
    "svc-5": "Streaming",
    "svc-6": "Open Source",
    "exp-title": "Experience & Education",
    "edu-1-role": "Electrical-Electronics Engineering (B.Sc.)",
    "edu-1-desc": "Senior Year Student (4th Grade). Specialized in Circuit Design, Power Systems, and Digital Signal Processing.",
    "edu-2-role": "R&D Intern (PCB Design)",
    "edu-2-desc": "Prototype development and multilayer PCB design within the R&D department. Experience with Altium Designer.",
    "edu-3-role": "Front-end Developer",
    "edu-3-desc": "Developed user interfaces for blockchain projects like gotabit.io using modern web technologies.",
    "proj-title": "Featured Projects",
    "proj-text": "A selection of projects I've built and shipped.",
    "journey-title": "My Journey",
    "journey-desc": "A visual timeline of the moments that shaped who I am — from my first circuit to shipping real products.",
    "j-1-title": "Born",
    "j-1-desc": "The beginning of everything. Born in Turkey.",
    "j-2-title": "First Lines of Code",
    "j-2-desc": "Started learning programming with Arduino. The moment hardware met software for the first time.",
    "j-3-title": "University Begins",
    "j-3-desc": "Started studying Electrical & Electronics Engineering at Çukurova University. Diving deep into circuit design, signal processing, and power systems.",
    "j-4-title": "Front-end Developer at Statu.co",
    "j-4-desc": "Built user interfaces for blockchain projects like gotabit.io. First professional software experience with React, TypeScript, and Web3.",
    "j-5-title": "Shipped Streamdoro",
    "j-5-desc": "Built and launched Streamdoro — a Pomodoro timer for Study With Me streamers with real-time OBS overlays, 3 themes, and 6 languages.",
    "j-6-title": "R&D Internship at Iskar Technologies",
    "j-6-desc": "Gained hands-on experience in prototype development and multilayer PCB design within the R&D department using Altium Designer.",
    "j-7-title": "Open Source & Streaming",
    "j-7-desc": "Started live coding sessions on YouTube, building open-source projects and sharing the engineering journey with the community.",
    "j-8-title": "What's Next?",
    "j-8-desc": "This is just the beginning. Curious about what's next? Let's connect and build something together.",
    "yt-title": "YouTube Channel",
    "yt-desc-text": "Join my live streams where I work on hardware design, write embedded firmware, and build modern web applications.",
    "yt-info-1": "Live Hardware & Software Coding",
    "yt-info-2": "Altium Designer, STM32 & React",
    "yt-info-3": "Interactive Q&A Sessions",
    "yt-btn": "Visit Channel",
    "spotify-title": "Recently Played & Repos",
    "spotify-source": "Recently Listened",
    "spotify-empty": "No recent tracks found",
    "github-title": "Recent Repos",
    "gallery-title": "Life Style",
    "gallery-1": "ENGINEERING LAB",
    "gallery-2": "SIMULATION",
    "gallery-3": "HARDWARE",
    "gallery-4": "FIELD WORK",
    "contact-cta": "Let's build<br>something.",
    "form-name": "NAME",
    "form-email": "EMAIL",
    "form-msg": "MESSAGE",
    "form-btn": "SEND MESSAGE",
    "form-success": "Message sent successfully!",
    "form-error": "Error. Please try again.",
    "footer-quote": "Building bridges between hardware and software.",
    "footer-rights": "All rights reserved",
    "last-updated-prefix": "Last updated:",
    "back-home": "← Back to home"
  },
  tr: {
    "hero-greeting": "Merhaba, ben Mustafa Kemal.",
    "hero-title": "Elektrik-Elektronik Mühendisi",
    "hero-slogan": "Donanım ve yazılım arasında köprüler kuruyorum.",
    "status-text": "Projeler için müsait",
    "tldr-text": "Mustafa Kemal, Çukurova Üniversitesi Elektrik-Elektronik Mühendisliği öğrencisidir. Gömülü Sistemler, IoT ve Endüstriyel Otomasyon alanlarında uzmanlaşmaktadır. PCB tasarımı, front-end geliştirme ve açık kaynak projelerle donanım ve yazılım arasındaki boşluğu doldurur.",
    "about-title": "Hakkımda",
    "about-text": "Çukurova Üniversitesi'nde son sınıf Elektrik-Elektronik Mühendisliği öğrencisiyim. Devre kartlarından web uygulamalarına kadar çalışan şeyler inşa etmeye tutkuyla bağlıyım. PCB tasarımı, mikrodenetleyici programlama, IoT çözümleri ve modern web arayüzleri geliştirme gibi geniş bir yelpazede çalışmayı seviyorum.",
    "badge-1": "4. Sınıf Öğrenci",
    "badge-2": "5+ Proje",
    "badge-3": "Gömülü Sistem Odaklı",
    "stat-years": "Yıllık Deneyim",
    "stat-projects": "Tamamlanan Proje",
    "stat-tech": "Teknoloji",
    "skill-cat-1": "Gömülü & Kontrol",
    "skill-cat-2": "Yazılım & Web",
    "nav-about": "Hakkımda",
    "nav-skills": "Yetkinlikler",
    "nav-experience": "Deneyim",
    "nav-projects": "Projeler",
    "nav-journey": "Yolculuk",
    "nav-stream": "Yayın",
    "nav-contact": "İletişim",
    "expertise-title": "Temel Yetkinlikler",
    "exp-1": "Gömülü Sistemler & Mikrodenetleyici Programlama (STM32, Arduino, ESP32)",
    "exp-2": "PCB Tasarımı & Prototipleme (Altium Designer)",
    "exp-3": "IoT Çözümleri & Endüstriyel Otomasyon",
    "exp-4": "Full-Stack Web Geliştirme (React, Next.js, Node.js)",
    "exp-5": "Devre Tasarımı & Güç Sistemleri Analizi",
    "services-title": "Ne Yapıyorum",
    "services-text": "Gömülü donanımdan web arayüzlerine — fiziksel ve dijital dünyalar arasında köprü kuran uçtan uca çözümler üretiyorum.",
    "svc-1": "Gömülü Sistemler",
    "svc-2": "IoT Çözümleri",
    "svc-3": "PCB Tasarımı",
    "svc-4": "Web Geliştirme",
    "svc-5": "Yayıncılık",
    "svc-6": "Açık Kaynak",
    "exp-title": "Deneyim & Eğitim",
    "edu-1-role": "Elektrik-Elektronik Mühendisliği (Lisans)",
    "edu-1-desc": "Devre Tasarımı, Güç Sistemleri ve Sinyal İşleme üzerine uzmanlaşan 4. sınıf öğrencisi.",
    "edu-2-role": "Ar-Ge Stajyeri (PCB Tasarım)",
    "edu-2-desc": "Ar-Ge departmanında prototip geliştirme, çok katmanlı PCB tasarımı ve donanım test süreçleri.",
    "edu-3-role": "Front-end Geliştirici",
    "edu-3-desc": "Blockchain ekosistemleri (gotabit.io) için modern web teknolojileri ile kullanıcı arayüzü geliştirme.",
    "proj-title": "Öne Çıkan Projeler",
    "proj-text": "Geliştirip yayınladığım projelerden bir seçki.",
    "journey-title": "Yolculuğum",
    "journey-desc": "Beni şekillendiren anların görsel zaman çizelgesi — ilk devremden gerçek ürünler teslim etmeye kadar.",
    "j-1-title": "Doğum",
    "j-1-desc": "Her şeyin başlangıcı. Türkiye'de doğdum.",
    "j-2-title": "İlk Kod Satırları",
    "j-2-desc": "Arduino ile programlama öğrenmeye başladım. Donanım ile yazılımın ilk kez buluştuğu an.",
    "j-3-title": "Üniversite Başlıyor",
    "j-3-desc": "Çukurova Üniversitesi Elektrik-Elektronik Mühendisliği okumaya başladım. Devre tasarımı, sinyal işleme ve güç sistemlerine derinlemesine dalış.",
    "j-4-title": "Statu.co'da Front-end Geliştirici",
    "j-4-desc": "gotabit.io gibi blockchain projeleri için kullanıcı arayüzleri geliştirdim. React, TypeScript ve Web3 ile ilk profesyonel yazılım deneyimim.",
    "j-5-title": "Streamdoro'yu Yayınladım",
    "j-5-desc": "Study With Me yayıncıları için gerçek zamanlı OBS overlayleri, 3 tema ve 6 dil desteğiyle Streamdoro'yu geliştirdim ve yayınladım.",
    "j-6-title": "Iskar Technologies'de Ar-Ge Stajı",
    "j-6-desc": "Altium Designer kullanarak Ar-Ge departmanında prototip geliştirme ve çok katmanlı PCB tasarımı deneyimi kazandım.",
    "j-7-title": "Açık Kaynak & Yayıncılık",
    "j-7-desc": "YouTube'da canlı kodlama oturumlarına başladım, açık kaynak projeler geliştirdim ve mühendislik yolculuğumu toplulukla paylaştım.",
    "j-8-title": "Sırada Ne Var?",
    "j-8-desc": "Bu sadece başlangıç. Sırada ne var merak ediyor musun? Hadi bağlantı kuralım ve birlikte bir şeyler inşa edelim.",
    "yt-title": "YouTube Kanalı",
    "yt-desc-text": "Donanım tasarımı yaptığım, gömülü yazılımlar yazdığım ve modern web uygulamaları geliştirdiğim canlı yayınlarıma katılın.",
    "yt-info-1": "Canlı Donanım & Yazılım Geliştirme",
    "yt-info-2": "Altium Designer, STM32 & React",
    "yt-info-3": "Canlı Soru-Cevap Oturumları",
    "yt-btn": "Kanala Git",
    "spotify-title": "Son Dinlenenler & Repolar",
    "spotify-source": "Son Dinlenenler",
    "spotify-empty": "Son dinlenen şarkı bulunamadı",
    "github-title": "Son Repolar",
    "gallery-title": "Yaşam Tarzı",
    "gallery-1": "MÜHENDİSLİK LABI",
    "gallery-2": "SİMÜLASYON",
    "gallery-3": "DONANIM",
    "gallery-4": "SAHA ÇALIŞMASI",
    "contact-cta": "Hadi bir şey<br>inşa edelim.",
    "form-name": "İSİM",
    "form-email": "E-POSTA",
    "form-msg": "MESAJ",
    "form-btn": "GÖNDER",
    "form-success": "Mesaj iletildi!",
    "form-error": "Hata. Tekrar deneyin.",
    "footer-quote": "Donanım ve yazılım arasında köprüler kuruyorum.",
    "footer-rights": "Tüm hakları saklıdır",
    "last-updated-prefix": "Son güncelleme:",
    "back-home": "← Ana sayfaya dön"
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const savedLang = localStorage.getItem('site-lang');
    return savedLang === 'tr' ? 'tr' : 'en';
  });

  useEffect(() => {
    localStorage.setItem('site-lang', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'tr' : 'en'));
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
