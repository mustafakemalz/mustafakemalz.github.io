import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import Icon from './Icon';

interface CommandMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface CommandAction {
  id: string;
  group: string;
  label: string;
  hint?: string;
  icon: string;
  keywords: string;
  onSelect: () => void;
}

export const CommandMenu: React.FC<CommandMenuProps> = ({ open, onOpenChange }) => {
  const { language, toggleLanguage } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [copiedToast, setCopiedToast] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isTr = language === 'tr';

  const scrollToSection = (targetId: string) => {
    onOpenChange(false);
    const isHomePage = location.pathname === '/';
    if (!isHomePage) {
      navigate('/', { state: { scrollTo: targetId } });
      return;
    }
    if (targetId === '#top') {
      if ((window as any).lenis) {
        (window as any).lenis.scrollTo(0, { duration: 1.1 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }
    const el = document.querySelector(targetId);
    if (el) {
      const navOffset = window.innerWidth <= 768 ? -64 : -72;
      if ((window as any).lenis) {
        (window as any).lenis.scrollTo(el, { offset: navOffset, duration: 1.1 });
      } else {
        const y = el.getBoundingClientRect().top + window.scrollY + navOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  const goRoute = (path: string) => {
    onOpenChange(false);
    navigate(path);
  };

  const openExternal = (url: string) => {
    onOpenChange(false);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const actions: CommandAction[] = useMemo(
    () => [
      {
        id: 'sec-top',
        group: isTr ? 'Gezinme' : 'Navigation',
        label: isTr ? 'Ana Sayfa (En Üst)' : 'Home (Top)',
        hint: '00 / hero',
        icon: 'terminal',
        keywords: 'home top hero mustafa kemal ana sayfa',
        onSelect: () => scrollToSection('#top'),
      },
      {
        id: 'sec-about',
        group: isTr ? 'Gezinme' : 'Navigation',
        label: isTr ? 'Hakkımda & Yetenekler' : 'About & Skills',
        hint: '01 / about',
        icon: 'microchip',
        keywords: 'about skills stm32 esp32 altium solidworks hakkimda',
        onSelect: () => scrollToSection('#about'),
      },
      {
        id: 'sec-services',
        group: isTr ? 'Gezinme' : 'Navigation',
        label: isTr ? 'Ne Yapıyorum' : 'What I Do',
        hint: '02 / capabilities',
        icon: 'gears',
        keywords: 'services capabilities embedded automation pcb ai ne yapiyorum',
        onSelect: () => scrollToSection('#services'),
      },
      {
        id: 'sec-experience',
        group: isTr ? 'Gezinme' : 'Navigation',
        label: isTr ? 'Deneyim & Eğitim' : 'Experience & Education',
        hint: '03 / experience',
        icon: 'layer-group',
        keywords: 'experience education elman cukurova iskar statu deneyim egitim',
        onSelect: () => scrollToSection('#experience'),
      },
      {
        id: 'sec-projects',
        group: isTr ? 'Gezinme' : 'Navigation',
        label: isTr ? 'Öne Çıkan Projeler' : 'Featured Projects',
        hint: '04 / projects',
        icon: 'code',
        keywords: 'projects opencontroller streamdoro fragstat shareroute projeler',
        onSelect: () => scrollToSection('#projects'),
      },
      {
        id: 'sec-widgets',
        group: isTr ? 'Gezinme' : 'Navigation',
        label: isTr ? 'Spotify & GitHub Aktivitesi' : 'Spotify & GitHub Activity',
        hint: '05 / live',
        icon: 'spotify',
        keywords: 'spotify github music repos canli aktivite',
        onSelect: () => scrollToSection('#widgets'),
      },
      {
        id: 'sec-contact',
        group: isTr ? 'Gezinme' : 'Navigation',
        label: isTr ? 'İletişim Formu' : 'Contact Form',
        hint: '07 / contact',
        icon: 'paper-plane',
        keywords: 'contact email message iletisim mesaj',
        onSelect: () => scrollToSection('#contact'),
      },
      {
        id: 'page-journey',
        group: isTr ? 'Sayfalar' : 'Pages',
        label: isTr ? 'Yolculuğum (Zaman Çizelgesi)' : 'My Journey (Timeline)',
        hint: '/journey',
        icon: 'code-branch',
        keywords: 'journey timeline story yolculuk',
        onSelect: () => goRoute('/journey'),
      },
      {
        id: 'page-sistem',
        group: isTr ? 'Sayfalar' : 'Pages',
        label: isTr ? 'Sistem & Ekipman' : 'System & Workstation Specs',
        hint: '/sistem',
        icon: 'desktop',
        keywords: 'sistem setup pc hardware ryzen radeon workstation',
        onSelect: () => goRoute('/sistem'),
      },
      {
        id: 'page-links',
        group: isTr ? 'Sayfalar' : 'Pages',
        label: 'LinkHub',
        hint: '/links',
        icon: 'wifi',
        keywords: 'links linkhub social linktree',
        onSelect: () => goRoute('/links'),
      },
      {
        id: 'page-card',
        group: isTr ? 'Sayfalar' : 'Pages',
        label: isTr ? 'Dijital Kartvizit (vCard)' : 'Digital Business Card (vCard)',
        hint: '/card',
        icon: 'cube',
        keywords: 'card vcard qr contact digital kartvizit',
        onSelect: () => goRoute('/card'),
      },
      {
        id: 'act-theme',
        group: isTr ? 'Hızlı İşlemler' : 'Quick Actions',
        label: isTr
          ? `Temayı Değiştir (${theme === 'dark' ? 'Açık Mod' : 'Koyu Mod'})`
          : `Switch Theme (to ${theme === 'dark' ? 'Light' : 'Dark'})`,
        hint: 'Theme',
        icon: theme === 'dark' ? 'sun' : 'moon',
        keywords: 'theme dark light mode tema renk',
        onSelect: () => {
          toggleTheme();
          onOpenChange(false);
        },
      },
      {
        id: 'act-lang',
        group: isTr ? 'Hızlı İşlemler' : 'Quick Actions',
        label: isTr ? 'Dili İngilizce Yap (EN)' : 'Switch Language to Turkish (TR)',
        hint: language.toUpperCase(),
        icon: 'wand-magic-sparkles',
        keywords: 'language english turkish dil tr en',
        onSelect: () => {
          toggleLanguage();
          onOpenChange(false);
        },
      },
      {
        id: 'act-email',
        group: isTr ? 'Hızlı İşlemler' : 'Quick Actions',
        label: copiedToast
          ? isTr
            ? 'E-posta Kopyalandı!'
            : 'Email Copied!'
          : isTr
          ? 'E-posta Adresini Kopyala'
          : 'Copy Email Address',
        hint: 'mustafakemalgocer@gmail.com',
        icon: 'circle-check',
        keywords: 'copy email mail kopyala mustafakemalgocer',
        onSelect: () => {
          navigator.clipboard?.writeText('mustafakemalgocer@gmail.com');
          setCopiedToast(true);
          setTimeout(() => {
            setCopiedToast(false);
            onOpenChange(false);
          }, 650);
        },
      },
      {
        id: 'soc-github',
        group: isTr ? 'Sosyal & Bağlantılar' : 'Social & External',
        label: 'GitHub',
        hint: '@mustafakemalz ↗',
        icon: 'github',
        keywords: 'github code open source repo',
        onSelect: () => openExternal('https://github.com/mustafakemalz'),
      },
      {
        id: 'soc-linkedin',
        group: isTr ? 'Sosyal & Bağlantılar' : 'Social & External',
        label: 'LinkedIn',
        hint: 'mustafa-kemal-göçer ↗',
        icon: 'linkedin-in',
        keywords: 'linkedin career network',
        onSelect: () =>
          openExternal('https://tr.linkedin.com/in/mustafa-kemal-g%C3%B6%C3%A7er-41409b255'),
      },
      {
        id: 'soc-instagram',
        group: isTr ? 'Sosyal & Bağlantılar' : 'Social & External',
        label: 'Instagram',
        hint: '@jpeg.muskz ↗',
        icon: 'instagram',
        keywords: 'instagram photo social jpeg.muskz',
        onSelect: () => openExternal('https://www.instagram.com/jpeg.muskz/'),
      },
    ],
    [isTr, theme, language, copiedToast, location.pathname]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter(
      (a) =>
        a.label.toLowerCase().includes(q) ||
        a.group.toLowerCase().includes(q) ||
        (a.hint && a.hint.toLowerCase().includes(q)) ||
        a.keywords.toLowerCase().includes(q)
    );
  }, [actions, query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query, open]);

  useEffect(() => {
    if (open) {
      setQuery('');
      const timer = setTimeout(() => inputRef.current?.focus(), 20);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Global Ctrl+K / Cmd+K shortcut
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onOpenChange(!open);
        return;
      }
      if (!open) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onOpenChange(false);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => (filtered.length ? (prev + 1) % filtered.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) =>
          filtered.length ? (prev - 1 + filtered.length) % filtered.length : 0
        );
      } else if (e.key === 'Enter' && filtered[activeIndex]) {
        e.preventDefault();
        filtered[activeIndex].onSelect();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onOpenChange, filtered, activeIndex]);

  if (!open) return null;

  // Group filtered items preserving order
  const groups: { name: string; items: { item: CommandAction; flatIdx: number }[] }[] = [];
  filtered.forEach((item, idx) => {
    let g = groups.find((x) => x.name === item.group);
    if (!g) {
      g = { name: item.group, items: [] };
      groups.push(g);
    }
    g.items.push({ item, flatIdx: idx });
  });

  return (
    <div
      className="cmd-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Command Menu"
      onClick={(e) => {
        if (e.target === e.currentTarget) onOpenChange(false);
      }}
    >
      <div className="cmd-dialog">
        <div className="cmd-search-bar">
          <Icon name="search" className="cmd-search-icon" />
          <input
            ref={inputRef}
            type="text"
            className="cmd-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              isTr
                ? 'Bir komut yazın veya bölüm arayın...'
                : 'Type a command or search sections...'
            }
            aria-label="Command search"
          />
          <kbd className="cmd-kbd" onClick={() => onOpenChange(false)}>
            ESC
          </kbd>
        </div>

        <div className="cmd-list" role="listbox">
          {groups.length === 0 ? (
            <div className="cmd-empty">
              {isTr ? 'Sonuç bulunamadı.' : 'No matching commands found.'}
            </div>
          ) : (
            groups.map((g) => (
              <div className="cmd-group" key={g.name}>
                <div className="cmd-group-heading">{g.name}</div>
                {g.items.map(({ item, flatIdx }) => {
                  const isActive = flatIdx === activeIndex;
                  return (
                    <button
                      type="button"
                      key={item.id}
                      role="option"
                      aria-selected={isActive}
                      className={`cmd-item ${isActive ? 'is-active' : ''}`}
                      onMouseEnter={() => setActiveIndex(flatIdx)}
                      onClick={() => item.onSelect()}
                    >
                      <span className="cmd-item-left">
                        <Icon name={item.icon} className="cmd-item-icon" />
                        <span className="cmd-item-label">{item.label}</span>
                      </span>
                      {item.hint && <span className="cmd-item-hint">{item.hint}</span>}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        <div className="cmd-footer">
          <span>
            <kbd>↑</kbd> <kbd>↓</kbd> {isTr ? 'seç' : 'navigate'}
          </span>
          <span>
            <kbd>↵</kbd> {isTr ? 'çalıştır' : 'select'}
          </span>
          <span>
            <kbd>Ctrl</kbd>+<kbd>K</kbd> {isTr ? 'kapat' : 'close'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CommandMenu;
