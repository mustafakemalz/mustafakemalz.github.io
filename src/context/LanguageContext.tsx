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
    "hero-role": "Electrical & Electronics Engineer · R&D at Elman Otomasyon",
    "hero-lead": "Designing industrial automation hardware, STM32/ESP32 firmware, multilayer PCBs in Altium Designer, and cross-platform control software in TypeScript and Electron.",
    "about-title": "Stack & Tooling",
    "nav-about": "Stack",
    "nav-experience": "Experience",
    "nav-projects": "Projects",
    "nav-journey": "Journey",
    "nav-contact": "Contact",
    "exp-title": "Experience & Education",
    "exp-0-role": "R&D Software & Automation Engineer",
    "exp-0-desc": "Writing STM32/ESP32 production firmware, PLC/sensor communication interfaces, and internal control tools for industrial machinery.",
    "edu-1-role": "B.Sc. in Electrical & Electronics Engineering",
    "edu-1-desc": "Completed degree with coursework and lab work in embedded microcontrollers, control theory, analog/digital circuit design, and power electronics.",
    "edu-2-role": "R&D Intern — PCB Design",
    "edu-2-desc": "Routed 4-layer mixed-signal PCBs in Altium Designer, assembled first-article prototypes, and ran board bring-up tests.",
    "edu-3-role": "Front-end Developer",
    "edu-3-desc": "Built React and TypeScript web interfaces and wallet integrations for cosmos-sdk applications including gotabit.io.",
    "proj-title": "Selected Work",
    "proj-opencontroller-desc": "Reverse-engineered proprietary USB HID gamepad packets and built an Electron + TypeScript desktop configurator for button remapping, deadzone curves, and polling telemetry.",
    "proj-streamdoro-desc": "Built a browser-source Pomodoro timer for OBS Studio using Next.js and WebSockets with real-time state sync across 3 themes and 6 languages.",
    "proj-fragstat-desc": "Created a low-footprint OBS browser overlay in React that queries FACEIT match APIs to display live ELO, K/D ratio, and map win rates.",
    "proj-shareroute-desc": "Developing a React Native + Supabase mobile app for recording, indexing, and sharing multi-stop driving routes.",
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
    "contact-lead": "For hardware R&D, embedded firmware, or software inquiries, send a message directly or reach out via email.",
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
    "hero-role": "Elektrik-Elektronik Mühendisi · Elman Otomasyon Ar-Ge",
    "hero-lead": "Endüstriyel otomasyon donanımları, STM32/ESP32 gömülü yazılımları, Altium Designer ile çok katmanlı PCB'ler ve TypeScript/Electron tabanlı masaüstü kontrol yazılımları geliştiriyorum.",
    "about-title": "Teknoloji & Araçlar",
    "nav-about": "Teknolojiler",
    "nav-experience": "Deneyim",
    "nav-projects": "Projeler",
    "nav-journey": "Yolculuk",
    "nav-contact": "İletişim",
    "exp-title": "Deneyim & Eğitim",
    "exp-0-role": "Ar-Ge Yazılım & Otomasyon Mühendisi",
    "exp-0-desc": "Endüstriyel makineler için STM32/ESP32 gömülü yazılımları, sensör/PLC haberleşme arayüzleri ve saha kontrol yazılımları geliştirme.",
    "edu-1-role": "Elektrik-Elektronik Mühendisliği (Lisans)",
    "edu-1-desc": "Gömülü mikrodenetleyiciler, otomatik kontrol, analog/sayısal devre tasarımı ve güç elektroniği laboratuvar ve proje çalışmalarıyla lisans mezuniyeti.",
    "edu-2-role": "Ar-Ge Stajyeri — PCB Tasarım",
    "edu-2-desc": "Altium Designer ile 4 katmanlı karma sinyalli PCB çizimi, ilk prototip dizgisi ve donanım doğrulama testleri.",
    "edu-3-role": "Front-end Geliştirici",
    "edu-3-desc": "gotabit.io dahil Cosmos-SDK tabanlı uygulamalar için React ve TypeScript ile web arayüzleri ve cüzdan entegrasyonları geliştirme.",
    "proj-title": "Seçili Projeler",
    "proj-opencontroller-desc": "Özel USB HID oyun kolu paketlerinin tersine mühendisliği ile tuş atama, ölü bölge eğrileri ve anlık telemetri sunan Electron + TypeScript masaüstü yazılımı.",
    "proj-streamdoro-desc": "OBS Studio için Next.js ve WebSocket kullanılarak geliştirilen, 3 tema ve 6 dil destekli gerçek zamanlı yayın Pomodoro sayacı.",
    "proj-fragstat-desc": "FACEIT API üzerinden canlı ELO, K/D oranı ve harita istatistiklerini çeken düşük kaynak tüketimli React OBS yayın katmanı.",
    "proj-shareroute-desc": "Çok duraklı sürüş rotalarını kaydetmek, indekslemek ve paylaşmak için React Native ve Supabase ile geliştirilen mobil uygulama.",
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
    "contact-lead": "Donanım Ar-Ge, gömülü yazılım veya masaüstü/web projeleri için doğrudan form üzerinden veya e-posta ile ulaşabilirsiniz.",
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
