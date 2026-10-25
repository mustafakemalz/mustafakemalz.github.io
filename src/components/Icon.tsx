import React from 'react';

export interface IconProps {
  name: string;
  className?: string;
  style?: React.CSSProperties;
  title?: string;
  size?: number | string;
}

const normalizeName = (raw: string): string => {
  const parts = raw.trim().split(/\s+/);
  for (let i = parts.length - 1; i >= 0; i--) {
    const token = parts[i];
    if (
      token.startsWith('fa-') &&
      token !== 'fa-solid' &&
      token !== 'fa-brands' &&
      token !== 'fa-regular'
    ) {
      return token.slice(3);
    }
  }
  return raw.replace(/^fa-/, '');
};

export const Icon: React.FC<IconProps> = ({
  name,
  className = '',
  style,
  title,
  size = '1em',
}) => {
  const key = normalizeName(name);
  const svgProps = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.85,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className: `inline-icon ${className}`.trim(),
    style: {
      verticalAlign: '-0.125em',
      flexShrink: 0,
      ...style,
    },
    'aria-hidden': title ? undefined : true,
    role: title ? 'img' : undefined,
  };

  switch (key) {
    case 'github':
      return (
        <svg {...svgProps} fill="currentColor" stroke="none">
          {title ? <title>{title}</title> : null}
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.207 11.387.6.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.5 11.5 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
        </svg>
      );
    case 'spotify':
      return (
        <svg {...svgProps} fill="currentColor" stroke="none">
          {title ? <title>{title}</title> : null}
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
        </svg>
      );
    case 'discord':
      return (
        <svg {...svgProps} fill="currentColor" stroke="none">
          {title ? <title>{title}</title> : null}
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
        </svg>
      );
    case 'linkedin-in':
    case 'linkedin':
      return (
        <svg {...svgProps} fill="currentColor" stroke="none">
          {title ? <title>{title}</title> : null}
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
        </svg>
      );
    case 'instagram':
      return (
        <svg {...svgProps}>
          {title ? <title>{title}</title> : null}
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      );
    case 'react':
      return (
        <svg {...svgProps}>
          {title ? <title>{title}</title> : null}
          <circle cx="12" cy="12" r="2.2" fill="currentColor" />
          <ellipse cx="12" cy="12" rx="10" ry="4.2" />
          <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(120 12 12)" />
        </svg>
      );
    case 'electron':
    case 'atom':
      return (
        <svg {...svgProps}>
          {title ? <title>{title}</title> : null}
          <ellipse cx="12" cy="12" rx="9.5" ry="3.8" transform="rotate(30 12 12)" />
          <ellipse cx="12" cy="12" rx="9.5" ry="3.8" transform="rotate(-30 12 12)" />
          <ellipse cx="12" cy="12" rx="3.8" ry="9.5" />
          <circle cx="12" cy="2.5" r="1.4" fill="currentColor" stroke="none" />
          <circle cx="3.8" cy="16.7" r="1.4" fill="currentColor" stroke="none" />
          <circle cx="20.2" cy="16.7" r="1.4" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'node-js':
      return (
        <svg {...svgProps}>
          {title ? <title>{title}</title> : null}
          <path d="M12 2 3.5 7v10L12 22l8.5-5V7L12 2Z" />
          <path d="M12 8v8" />
          <path d="m8.5 10 7 4" />
        </svg>
      );
    case 'raspberry-pi':
      return (
        <svg {...svgProps}>
          {title ? <title>{title}</title> : null}
          <path d="M8.5 3c1.5 0 3 1.2 3.5 2.5C12.5 4.2 14 3 15.5 3c1.2 0 2 1 2 2.2 0 1.5-1.5 2.8-3.5 3.3" />
          <circle cx="12" cy="14" r="6.5" />
          <circle cx="10" cy="12.5" r="1" fill="currentColor" />
          <circle cx="14" cy="12.5" r="1" fill="currentColor" />
          <circle cx="12" cy="15.8" r="1" fill="currentColor" />
        </svg>
      );
    case 'microchip':
      return (
        <svg {...svgProps}>
          {title ? <title>{title}</title> : null}
          <rect x="6" y="6" width="12" height="12" rx="2" />
          <rect x="9" y="9" width="6" height="6" rx="1" />
          <path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" />
        </svg>
      );
    case 'layer-group':
      return (
        <svg {...svgProps}>
          {title ? <title>{title}</title> : null}
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 12 12 17 22 12" />
          <polyline points="2 17 12 22 22 17" />
        </svg>
      );
    case 'cube':
      return (
        <svg {...svgProps}>
          {title ? <title>{title}</title> : null}
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      );
    case 'gears':
      return (
        <svg {...svgProps}>
          {title ? <title>{title}</title> : null}
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      );
    case 'wifi':
      return (
        <svg {...svgProps}>
          {title ? <title>{title}</title> : null}
          <path d="M5 12.55a11 11 0 0 1 14.08 0" />
          <path d="M1.42 9a16 16 0 0 1 21.16 0" />
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
          <line x1="12" y1="20" x2="12.01" y2="20" />
        </svg>
      );
    case 'code':
      return (
        <svg {...svgProps}>
          {title ? <title>{title}</title> : null}
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      );
    case 'code-branch':
      return (
        <svg {...svgProps}>
          {title ? <title>{title}</title> : null}
          <line x1="6" y1="3" x2="6" y2="15" />
          <circle cx="18" cy="6" r="3" />
          <circle cx="6" cy="18" r="3" />
          <path d="M18 9a9 9 0 0 1-9 9" />
        </svg>
      );
    case 'usb':
      return (
        <svg {...svgProps}>
          {title ? <title>{title}</title> : null}
          <circle cx="10" cy="7" r="1" />
          <circle cx="4" cy="20" r="1" />
          <path d="M4.7 19.3 19 5" />
          <path d="m21 3-3 1 2 2Z" />
          <path d="M9.26 7.68 5 12l2 5" />
          <path d="m10 14 5 2 3.5-3.5" />
          <path d="m18 12 1-1 1 1-1 1Z" />
        </svg>
      );
    case 'brain':
      return (
        <svg {...svgProps}>
          {title ? <title>{title}</title> : null}
          <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04Z" />
          <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04Z" />
        </svg>
      );
    case 'terminal':
      return (
        <svg {...svgProps}>
          {title ? <title>{title}</title> : null}
          <polyline points="4 17 10 11 4 5" />
          <line x1="12" y1="19" x2="20" y2="19" />
        </svg>
      );
    case 'wand-magic-sparkles':
      return (
        <svg {...svgProps}>
          {title ? <title>{title}</title> : null}
          <path d="m15 4-1 1 6 6 1-1a2.83 2.83 0 0 0-4-4l-2-2Z" />
          <path d="m13 6-9.5 9.5a2.12 2.12 0 0 0 3 3L16 9" />
          <path d="M6 3v3M4.5 4.5h3M19 15v3M17.5 16.5h3" />
        </svg>
      );
    case 'robot':
      return (
        <svg {...svgProps}>
          {title ? <title>{title}</title> : null}
          <rect x="3" y="8" width="18" height="12" rx="3" />
          <path d="M12 4v4M9 13v2M15 13v2M9 17h6" />
          <circle cx="12" cy="3" r="1" />
        </svg>
      );
    case 'moon':
      return (
        <svg {...svgProps}>
          {title ? <title>{title}</title> : null}
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      );
    case 'sun':
      return (
        <svg {...svgProps}>
          {title ? <title>{title}</title> : null}
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      );
    case 'arrow-up-right-from-square':
      return (
        <svg {...svgProps}>
          {title ? <title>{title}</title> : null}
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
      );
    case 'paper-plane':
      return (
        <svg {...svgProps}>
          {title ? <title>{title}</title> : null}
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      );
    case 'circle-check':
      return (
        <svg {...svgProps}>
          {title ? <title>{title}</title> : null}
          <circle cx="12" cy="12" r="9" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case 'circle':
      return (
        <svg {...svgProps} fill="currentColor" stroke="none">
          {title ? <title>{title}</title> : null}
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
    case 'vr-cardboard':
      return (
        <svg {...svgProps}>
          {title ? <title>{title}</title> : null}
          <rect x="2" y="6" width="20" height="12" rx="3" />
          <path d="M9 18l3-3 3 3" />
          <circle cx="7.5" cy="12" r="2" />
          <circle cx="16.5" cy="12" r="2" />
        </svg>
      );
    case 'memory':
      return (
        <svg {...svgProps}>
          {title ? <title>{title}</title> : null}
          <rect x="2" y="6" width="20" height="10" rx="2" />
          <path d="M6 10v2M10 10v2M14 10v2M18 10v2M6 16v3M10 16v3M14 16v3M18 16v3" />
        </svg>
      );
    case 'folder-open':
      return (
        <svg {...svgProps}>
          {title ? <title>{title}</title> : null}
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
      );
    case 'hard-drive':
      return (
        <svg {...svgProps}>
          {title ? <title>{title}</title> : null}
          <line x1="22" y1="12" x2="2" y2="12" />
          <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
          <line x1="6" y1="16" x2="6.01" y2="16" />
          <line x1="10" y1="16" x2="10.01" y2="16" />
        </svg>
      );
    case 'plug':
      return (
        <svg {...svgProps}>
          {title ? <title>{title}</title> : null}
          <path d="M12 22v-5" />
          <path d="M9 8V2" />
          <path d="M15 8V2" />
          <path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z" />
        </svg>
      );
    case 'desktop':
      return (
        <svg {...svgProps}>
          {title ? <title>{title}</title> : null}
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      );
    case 'keyboard':
      return (
        <svg {...svgProps}>
          {title ? <title>{title}</title> : null}
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <path d="M6 9h.01M10 9h.01M14 9h.01M18 9h.01M6 13h.01M18 13h.01M8 15h8" />
        </svg>
      );
    case 'mouse':
      return (
        <svg {...svgProps}>
          {title ? <title>{title}</title> : null}
          <rect x="6" y="3" width="12" height="18" rx="6" />
          <line x1="12" y1="7" x2="12" y2="11" />
        </svg>
      );
    case 'search':
      return (
        <svg {...svgProps}>
          {title ? <title>{title}</title> : null}
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      );
    case 'typescript':
      return (
        <svg {...svgProps} fill="currentColor" stroke="none">
          {title ? <title>{title}</title> : null}
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3 3h18v18H3V3zm10.7 9.1h-2.2v6.6H9.8v-6.6H7.6v-1.5h6.1v1.5zm4.1 6.7c-1.1 0-2-.4-2.6-1l.9-1.2c.4.4 1 .7 1.6.7.7 0 1.1-.3 1.1-.8 0-.5-.4-.7-1.3-1.1-1.3-.5-2.1-1.1-2.1-2.3 0-1.3 1-2.2 2.5-2.2 1 0 1.8.3 2.4.8l-.9 1.1c-.4-.3-.9-.5-1.5-.5-.6 0-1 .3-1 .7 0 .5.4.7 1.4 1.1 1.3.5 2 1.1 2 2.3 0 1.4-1.1 2.4-2.5 2.4z"
          />
        </svg>
      );
    case 'javascript':
      return (
        <svg {...svgProps} fill="currentColor" stroke="none">
          {title ? <title>{title}</title> : null}
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3 3h18v18H3V3zm9.5 13.4c0 1.5-.9 2.2-2.2 2.2-.9 0-1.6-.4-2-.9l1.1-.9c.2.4.5.6.9.6.5 0 .8-.2.8-.9v-5h1.4v4.9zm4.7 2.2c-1.2 0-2-.5-2.5-1.3l1.1-.8c.3.5.7.9 1.4.9.6 0 1-.3 1-.8 0-.5-.4-.7-1.2-1.1-1.2-.5-2-1.1-2-2.3 0-1.2.9-2.1 2.3-2.1 1 0 1.7.3 2.2 1l-1 .8c-.3-.4-.6-.6-1.2-.6-.5 0-.9.3-.9.7 0 .5.3.7 1.2 1.1 1.2.5 2 1.1 2 2.3 0 1.4-1.1 2.2-2.4 2.2z"
          />
        </svg>
      );
    case 'python':
      return (
        <svg {...svgProps} fill="currentColor" stroke="none">
          {title ? <title>{title}</title> : null}
          <path d="M11.9 2c-4.1 0-3.8 1.8-3.8 1.8v1.9h3.9v.6H6.5S3 5.9 3 9.9c0 4 3.1 3.9 3.1 3.9h1.8v-1.9s-.1-2.2 2.2-2.2h3.8s2.1 0 2.1-2V4.1S16.3 2 11.9 2zm-2.1 1.2c.4 0 .7.3.7.7s-.3.7-.7.7-.7-.3-.7-.7.3-.7.7-.7zm2.3 18.8c4.1 0 3.8-1.8 3.8-1.8v-1.9H12v-.6h5.5S21 18.1 21 14.1c0-4-3.1-3.9-3.1-3.9h-1.8v1.9s.1 2.2-2.2 2.2h-3.8s-2.1 0-2.1 2v3.6S7.7 22 12.1 22zm2.1-1.2c-.4 0-.7-.3-.7-.7s.3-.7.7-.7.7.3.7.7-.3.7-.7.7z" />
        </svg>
      );
    case 'cpp':
      return (
        <svg {...svgProps}>
          {title ? <title>{title}</title> : null}
          <path d="M10 8.5a4 4 0 1 0 0 7" />
          <path d="M13.5 12h3M15 10.5v3M18.5 12h3M20 10.5v3" />
        </svg>
      );
    case 'nextjs':
      return (
        <svg {...svgProps} fill="currentColor" stroke="none">
          {title ? <title>{title}</title> : null}
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.25 14.65L9.72 8.2v6.8H8.3V6.9h1.68l5.8 7.52V6.9h1.42v9.2l-.95.55z" />
        </svg>
      );
    case 'tailwind':
      return (
        <svg {...svgProps} fill="currentColor" stroke="none">
          {title ? <title>{title}</title> : null}
          <path d="M12 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35.98 1 2.09 2.15 4.59 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.91-1.35C15.61 7.15 14.5 6 12 6zm-5 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.3.74 1.91 1.35C8.39 16.85 9.5 18 12 18c2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.91-1.35C10.61 13.15 9.5 12 7 12z" />
        </svg>
      );
    case 'docker':
      return (
        <svg {...svgProps} fill="currentColor" stroke="none">
          {title ? <title>{title}</title> : null}
          <path d="M13 5h2v2h-2V5zm-3 0h2v2h-2V5zM7 5h2v2H7V5zm6 3h2v2h-2V8zm-3 0h2v2h-2V8zM7 8h2v2H7V8zM4 8h2v2H4V8zm16.5 3.2c-.5-.3-1.5-.4-2.3-.2-.2-.9-.8-1.7-1.6-2.2l-.3-.2-.2.3c-.4.6-.5 1.6-.1 2.3-.4.2-1.1.4-2 .4H2.2l-.1.6c-.2 1.9.2 3.8 1.2 5.3 1 1.5 2.6 2.3 4.7 2.3 4.5 0 7.8-2.1 9.4-5.9.7 0 2.1 0 2.8-1.4l.2-.4-.4-.9z" />
        </svg>
      );
    case 'git':
      return (
        <svg {...svgProps}>
          {title ? <title>{title}</title> : null}
          <circle cx="18" cy="18" r="3" />
          <circle cx="6" cy="6" r="3" />
          <path d="M13 6h3a2 2 0 0 1 2 2v7" />
          <line x1="6" y1="9" x2="6" y2="21" />
        </svg>
      );
    case 'linux':
      return (
        <svg {...svgProps}>
          {title ? <title>{title}</title> : null}
          <path d="M12 3c-2.5 0-4 2-4 5 0 1.8-.8 3.5-1.8 5.2-.9 1.5-1.2 3.3-.2 4.8.8 1.2 2.2 2 3.5 2h5c1.3 0 2.7-.8 3.5-2 1-1.5.7-3.3-.2-4.8-1-1.7-1.8-3.4-1.8-5.2 0-3-1.5-5-4-5z" />
          <path d="M10 8h.01M14 8h.01M10.5 11c.9.6 2.1.6 3 0" />
        </svg>
      );
    case 'supabase':
      return (
        <svg {...svgProps} fill="currentColor" stroke="none">
          {title ? <title>{title}</title> : null}
          <path d="M13.5 2.2c-.5-.6-1.5-.2-1.5.6V11h7.2c.8 0 1.3.9.8 1.6l-7.5 9.2c-.5.6-1.5.2-1.5-.6V13H3.8c-.8 0-1.3-.9-.8-1.6l7.5-9.2z" />
        </svg>
      );
    default:
      return (
        <svg {...svgProps}>
          {title ? <title>{title}</title> : null}
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
  }
};

export default Icon;
