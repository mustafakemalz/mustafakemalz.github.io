import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'tr';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    "hero-name": "Mustafa Kemal Göçer",
    "hero-role": "Electrical & Electronics Engineer · Software Developer",
    "hero-lead": "Designing hardware, embedded systems, and AI-assisted modern software.",
    "hero-status": "Open for collaborations",
    "about-title": "Stack & Tooling",
    "nav-about": "Stack",
    "nav-experience": "Experience",
    "nav-projects": "Projects",
    "nav-journey": "Journey",
    "nav-contact": "Contact",
    "exp-title": "Experience & Education",
    "exp-0-role": "R&D Software & Automation Engineer",
    "exp-0-desc": "STM32/ESP32 embedded firmware, industrial bus protocols, and control software.",
    "edu-1-role": "B.Sc. in Electrical & Electronics Engineering",
    "edu-1-desc": "Embedded systems, digital circuit design, and control theory.",
    "edu-2-role": "R&D Intern — PCB Design",
    "edu-2-desc": "Multilayer PCB routing in Altium Designer and hardware bring-up.",
    "edu-3-role": "Front-end Developer",
    "edu-3-desc": "Web3 interfaces and wallet integrations with React & TypeScript.",
    "proj-title": "Selected Work",
    "proj-opencontroller-desc": "USB HID gamepad telemetry, button mapping, and desktop configurator.",
    "proj-streamdoro-desc": "Real-time WebSocket broadcast timer built for OBS Studio.",
    "proj-fragstat-desc": "Lightweight OBS broadcast overlay for real-time FACEIT match data.",
    "proj-shareroute-desc": "Mobile platform for recording, indexing, and sharing driving routes.",
    "journey-title": "Timeline",
    "journey-desc": "Chronological log of hardware, firmware, and software milestones.",
    "j-1-title": "Adana, Turkey",
    "j-1-desc": "Born in Turkey.",
    "j-2-title": "First Microcontroller Circuits",
    "j-2-desc": "Built first sensor and motor-driver breadboard circuits programmed in C++ on ATmega328P.",
    "j-3-title": "Çukurova University — EEE",
    "j-3-desc": "Enrolled in Electrical & Electronics Engineering, focusing on circuit analysis, signal processing, and embedded systems.",
    "j-4-title": "Statu.co — Front-end Developer",
    "j-4-desc": "Shipped production React and TypeScript interfaces for gotabit.io.",
    "j-5-title": "Streamdoro Launch",
    "j-5-desc": "Released Streamdoro.app for OBS streamers with real-time WebSocket controls.",
    "j-6-title": "Iskar Technologies — R&D Intern",
    "j-6-desc": "Designed multilayer PCBs in Altium Designer and validated hardware prototypes in the lab.",
    "j-7-title": "Open-Source Hardware & Software",
    "j-7-desc": "Published open-source desktop tools, firmware utilities, and PCB layouts on GitHub.",
    "j-8-title": "B.Sc. Graduation",
    "j-8-desc": "Graduated from Çukurova University with a B.Sc. in Electrical & Electronics Engineering.",
    "j-9-title": "Elman Otomasyon — R&D Engineer",
    "j-9-desc": "Joined the R&D team developing industrial automation hardware, ESP32/STM32 firmware, and control software.",
    "j-10-title": "OpenController Release",
    "j-10-desc": "Shipped OpenController v0.1.0 — USB HID reverse-engineering and controller configuration suite built with Electron and TypeScript.",
    "j-11-title": "Current Focus",
    "j-11-desc": "Building industrial field-bus controllers, custom PCBs, and local LLM automation tooling.",
    "gallery-title": "Lab & Field Notes",
    "gallery-1": "Lab bench — oscilloscope & logic analyzer bring-up",
    "gallery-2": "Multilayer PCB layout & signal simulation",
    "gallery-3": "Controller hardware & firmware test rig",
    "gallery-4": "Field installation & commissioning",
    "contact-cta": "Contact",
    "contact-lead": "Available for hardware R&D, embedded firmware, and software collaborations.",
    "form-name": "Name",
    "form-email": "Email",
    "form-msg": "Message",
    "form-btn": "Send message →",
    "form-success": "Message sent.",
    "form-error": "Delivery failed. Please email mustafakemalgocer@gmail.com directly.",
    "back-home": "← Index",
    "sistem-hero-title": "Workstation & Lab Setup",
    "sistem-hero-desc": "Primary desktop hardware and peripherals used for CAD, PCB layout, firmware compilation, and local LLM inference.",
    "watch-on-kick": "kick.com/muskz ↗",
    "cat-core": "System Components",
    "cat-peripherals": "Peripherals & Displays",
    "spec-cpu": "Processor",
    "spec-gpu": "Graphics",
    "spec-ram": "Memory",
    "spec-mobo": "Motherboard",
    "spec-storage": "Storage",
    "spec-case": "Chassis & PSU",
    "spec-monitor1": "Primary Display",
    "spec-monitor2": "Secondary Display",
    "spec-keyboard": "Keyboard",
    "spec-mouse": "Mouse",
    "not-found-title": "Route not found",
    "not-found-desc": "The requested path does not exist.",
    "not-found-back": "← Return to index"
  },
  tr: {
    "hero-name": "Mustafa Kemal Göçer",
    "hero-role": "Elektrik-Elektronik Mühendisi & Yazılımcı",
    "hero-lead": "Donanım, gömülü sistemler ve yapay zekâ destekli modern yazılımlar tasarlıyorum.",
    "hero-status": "İşbirliklerine açık",
    "about-title": "Teknoloji & Araçlar",
    "nav-about": "Teknolojiler",
    "nav-experience": "Deneyim",
    "nav-projects": "Projeler",
    "nav-journey": "Yolculuk",
    "nav-contact": "İletişim",
    "exp-title": "Deneyim & Eğitim",
    "exp-0-role": "Ar-Ge Yazılım & Otomasyon Mühendisi",
    "exp-0-desc": "STM32/ESP32 gömülü firmware, endüstriyel haberleşme ve kontrol yazılımları.",
    "edu-1-role": "Elektrik-Elektronik Mühendisliği",
    "edu-1-desc": "Gömülü sistemler, sayısal devre tasarımı ve kontrol teorisi.",
    "edu-2-role": "Ar-Ge Stajyeri — PCB Tasarım",
    "edu-2-desc": "Altium Designer ile çok katmanlı PCB tasarımı ve donanım prototipleme.",
    "edu-3-role": "Front-end Geliştirici",
    "edu-3-desc": "React ve TypeScript ile Web3 arayüzleri ve cüzdan entegrasyonları.",
    "proj-title": "Seçili Projeler",
    "proj-opencontroller-desc": "USB HID telemetri, tuş haritalama ve kontrolcü yapılandırma yazılımı.",
    "proj-streamdoro-desc": "OBS Studio için gerçek zamanlı WebSocket destekli yayın sayacı.",
    "proj-fragstat-desc": "FACEIT verilerini anlık aktaran hafif OBS canlı yayın katmanı.",
    "proj-shareroute-desc": "Sürüş rotalarını kaydeden ve paylaşan mobil rota platformu.",
    "journey-title": "Zaman Çizelgesi",
    "journey-desc": "Donanım, gömülü sistem ve yazılım kilometre taşları.",
    "j-1-title": "Adana, Türkiye",
    "j-1-desc": "Türkiye'de doğdum.",
    "j-2-title": "İlk Mikrodenetleyici Devreleri",
    "j-2-desc": "ATmega328P üzerinde C++ ile ilk sensör okuma ve motor sürücü devrelerini kurdum.",
    "j-3-title": "Çukurova Üniversitesi — EEM",
    "j-3-desc": "Elektrik-Elektronik Mühendisliği lisans eğitimine başladım; devre analizi, sinyal işleme ve gömülü sistemler üzerine yoğunlaştım.",
    "j-4-title": "Statu.co — Front-end Geliştirici",
    "j-4-desc": "gotabit.io için React ve TypeScript ile üretim ortamı arayüzleri geliştirdim.",
    "j-5-title": "Streamdoro Yayında",
    "j-5-desc": "Gerçek zamanlı WebSocket kontrolüne sahip OBS sayacı Streamdoro.app'i yayınladım.",
    "j-6-title": "Iskar Technologies — Ar-Ge Stajı",
    "j-6-desc": "Altium Designer ile çok katmanlı PCB tasarımı ve laboratuvar prototip testleri gerçekleştirdim.",
    "j-7-title": "Açık Kaynak Donanım & Yazılım",
    "j-7-desc": "Masaüstü donanım araçlarını, gömülü kütüphaneleri ve PCB tasarımlarını GitHub üzerinde açık kaynak olarak yayınladım.",
    "j-8-title": "Lisans Mezuniyeti",
    "j-8-desc": "Çukurova Üniversitesi Elektrik-Elektronik Mühendisliği bölümünden mezun oldum.",
    "j-9-title": "Elman Otomasyon — Ar-Ge Mühendisi",
    "j-9-desc": "Endüstriyel otomasyon donanımları, ESP32/STM32 gömülü yazılımları ve kontrol yazılımları geliştirmek üzere Ar-Ge ekibine katıldım.",
    "j-10-title": "OpenController v0.1.0",
    "j-10-desc": "USB HID tersine mühendislik ve kontrolcü yapılandırma aracı OpenController'ı Electron ve TypeScript ile yayınladım.",
    "j-11-title": "Güncel Odak",
    "j-11-desc": "Endüstriyel saha kontrolcüleri, çok katmanlı PCB'ler ve yerel LLM otomasyon araçları üzerine çalışıyorum.",
    "gallery-title": "Laboratuvar & Saha Notları",
    "gallery-1": "Laboratuvar — osiloskop ve lojik analizör testleri",
    "gallery-2": "Çok katmanlı PCB yerleşimi ve sinyal simülasyonu",
    "gallery-3": "Kontrolcü donanım ve gömülü yazılım test düzeneği",
    "gallery-4": "Saha kurulumu ve devreye alma",
    "contact-cta": "İletişim",
    "contact-lead": "Donanım, gömülü yazılım veya yeni projeler için mesaj bırakabilir ya da e-posta ile ulaşabilirsiniz.",
    "form-name": "İsim",
    "form-email": "E-posta",
    "form-msg": "Mesaj",
    "form-btn": "Mesajı gönder →",
    "form-success": "Mesaj iletildi.",
    "form-error": "Gönderilemedi. Doğrudan mustafakemalgocer@gmail.com adresine yazabilirsiniz.",
    "back-home": "← İndeks",
    "sistem-hero-title": "İş İstasyonu & Ekipman",
    "sistem-hero-desc": "CAD modelleme, PCB tasarımı, gömülü derleme ve yerel LLM çalıştırma süreçlerinde kullandığım donanım.",
    "watch-on-kick": "kick.com/muskz ↗",
    "cat-core": "Sistem Bileşenleri",
    "cat-peripherals": "Ekran & Çevre Birimleri",
    "spec-cpu": "İşlemci",
    "spec-gpu": "Ekran Kartı",
    "spec-ram": "Bellek",
    "spec-mobo": "Anakart",
    "spec-storage": "Depolama",
    "spec-case": "Kasa & Güç Kaynağı",
    "spec-monitor1": "Birincil Ekran",
    "spec-monitor2": "İkincil Ekran",
    "spec-keyboard": "Klavye",
    "spec-mouse": "Fare",
    "not-found-title": "Sayfa bulunamadı",
    "not-found-desc": "Aradığınız adres mevcut değil.",
    "not-found-back": "← Ana sayfaya dön"
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
