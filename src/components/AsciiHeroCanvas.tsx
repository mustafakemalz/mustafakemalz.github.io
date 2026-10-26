import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { HANDS_META, HAND_IMG_LEFT, HAND_IMG_RIGHT } from './asciiHandsData';

const LV = [
  ['.', '·'],
  ['·', ':', '.'],
  [':', '-', '·'],
  ['-', '=', ':'],
  ['=', '+', '-'],
  ['+', '*', '#'],
  ['#', '%', '@'],
];

function cl(v: number, a = 0, b = 1) {
  return Math.min(b, Math.max(a, v));
}

const ease = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function hash(x: number, y: number, t: number) {
  let h = x * 374761393 + y * 668265263 + t * 2147483647;
  h = (h ^ (h >> 13)) * 1274126177;
  return ((h ^ (h >> 16)) >>> 0) / 4294967295;
}

// 3D Polyhedron: Cube (8 vertices) + Dual Octahedron (6 vertices) = 14 vertices
const VERTICES_3D: [number, number, number][] = [
  // Cube vertices [-1..1]
  [-1, -1, -1],
  [1, -1, -1],
  [1, 1, -1],
  [-1, 1, -1],
  [-1, -1, 1],
  [1, -1, 1],
  [1, 1, 1],
  [-1, 1, 1],
  // Octahedron outer vertices
  [0, 0, -1.5],
  [0, 0, 1.5],
  [0, -1.5, 0],
  [0, 1.5, 0],
  [-1.5, 0, 0],
  [1.5, 0, 0],
];

const EDGES_3D: [number, number][] = [
  // Cube back face
  [0, 1], [1, 2], [2, 3], [3, 0],
  // Cube front face
  [4, 5], [5, 6], [6, 7], [7, 4],
  // Connecting edges
  [0, 4], [1, 5], [2, 6], [3, 7],
  // Octahedron edges connecting to axial vertices
  [8, 10], [8, 11], [8, 12], [8, 13],
  [9, 10], [9, 11], [9, 12], [9, 13],
  [10, 12], [12, 11], [11, 13], [13, 10],
];

export const AsciiHeroCanvas: React.FC = () => {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isVisibleRef = useRef<boolean>(true);
  const themeRef = useRef<string>(theme);
  const rebuildDotsRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    themeRef.current = theme;
    if (rebuildDotsRef.current) {
      rebuildDotsRef.current();
    }
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const off = document.createElement('canvas');
    const o = off.getContext('2d', { willReadFrequently: true });
    if (!o) return;

    // Pre-rendered static dot grid layer (single GPU draw call per frame)
    const dotLayer = document.createElement('canvas');
    const dotCtx = dotLayer.getContext('2d');

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const imgL = new Image();
    const imgR = new Image();
    let isMounted = true;
    let isRunning = false;
    let animationFrameId: number | null = null;
    let leftLoaded = false;
    let rightLoaded = false;
    let forceNextRender = true;
    let lastRenderTime = -1000;
    let render: (now: number) => void;

    let W = 0;
    let H = 0;
    let CS = 13;
    let cw = CS * 0.6;
    let ch = CS;
    let cols = 0;
    let rows = 0;
    let totalCells = 0;
    let dpr = 1;

    // Scroll and phase tracking
    let targetPhase = 0;
    let smoothPhase = 0;
    let mx = 0;
    let my = 0;
    let targetMx = 0;
    let targetMy = 0;
    let mousePixelX = -1000;
    let mousePixelY = -1000;
    let touchImpulse = 0;

    // Per-cell unified buffers for procedural multi-stage blending
    let cellL = new Float32Array(0);
    let cellChar = new Int32Array(0);
    let textMask = new Float32Array(0);
    let hasTextMask = false;
    let cachedNameRect: { left: number; top: number; right: number; bottom: number } | null = null;
    let cachedAvatarRect: { left: number; top: number; right: number; bottom: number } | null = null;

    // Pre-allocated bucket arrays (7 luminance levels) to batch fillStyle state changes
    const bucketsX: number[][] = Array.from({ length: 7 }, () => []);
    const bucketsY: number[][] = Array.from({ length: 7 }, () => []);
    const bucketsChar: string[][] = Array.from({ length: 7 }, () => []);

    // Pre-allocated 3D projection buffers for Phase 3 wireframe (eliminates per-frame heap churn)
    const projX = new Float32Array(14);
    const projY = new Float32Array(14);
    const projZ = new Float32Array(14);

    const startLoop = () => {
      if (!isMounted || isRunning || !isVisibleRef.current || !leftLoaded || !rightLoaded || !render) return;
      isRunning = true;
      forceNextRender = true;
      animationFrameId = requestAnimationFrame(render);
    };

    const stopLoop = () => {
      isRunning = false;
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    };

    const requestRender = () => {
      forceNextRender = true;
      if (!isRunning) {
        startLoop();
      }
    };

    const buildDotLayer = () => {
      if (!dotCtx || W <= 0 || H <= 0 || cols <= 0 || rows <= 0) return;
      dotLayer.width = Math.round(W * dpr);
      dotLayer.height = Math.round(H * dpr);
      dotCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dotCtx.clearRect(0, 0, W, H);
      const isDark = themeRef.current !== 'light';
      dotCtx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.075)' : 'rgba(0, 0, 0, 0.05)';
      for (let y = 0; y < rows; y++) {
        const Y = y * ch + ch / 2 - 0.6;
        for (let x = 0; x < cols; x++) {
          const X = x * cw + cw / 2 - 0.6;
          dotCtx.fillRect(X, Y, 1.25, 1.25);
        }
      }
      requestRender();
    };

    rebuildDotsRef.current = buildDotLayer;

    const checkReady = () => {
      if (!isMounted || !leftLoaded || !rightLoaded) return;
      startLoop();
    };

    const getAbsoluteTop = (el: HTMLElement | null, fallback: number) => {
      if (!el) return fallback;
      return el.getBoundingClientRect().top + window.scrollY;
    };

    // Cached document positions to eliminate layout thrashing during scroll
    let cachedHeroHeight = 800;
    let cachedAboutTop = 800;
    let cachedExpTop = 1500;
    let cachedProjTop = 2100;
    let cachedContactTop = 3200;

    const measureSectionPositions = () => {
      const vh = window.innerHeight;
      const heroEl = document.querySelector('.site-header') as HTMLElement | null;
      cachedHeroHeight = heroEl?.offsetHeight || vh;

      const aboutEl = document.getElementById('about');
      const expEl = document.getElementById('experience');
      const projEl = document.getElementById('projects');
      const contactEl = document.getElementById('contact');

      cachedAboutTop = getAbsoluteTop(aboutEl, cachedHeroHeight);
      cachedExpTop = getAbsoluteTop(expEl, cachedAboutTop + 600);
      cachedProjTop = getAbsoluteTop(projEl, cachedExpTop + 600);
      cachedContactTop = getAbsoluteTop(contactEl, cachedProjTop + 800);
    };

    // Continuous, C0-continuous piecewise scroll mapping across all 4 visual phases
    const updateScrollProgress = () => {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;

      const y0 = 0;
      const y1 = Math.max(120, cachedAboutTop - vh * 0.45);
      const y2 = Math.max(y1 + 150, cachedExpTop - vh * 0.35);
      const y3 = Math.max(y2 + 200, cachedContactTop - vh * 0.45);

      if (scrollY <= y0) {
        targetPhase = 0;
      } else if (scrollY < y1) {
        targetPhase = scrollY / y1;
      } else if (scrollY < y2) {
        targetPhase = 1.0 + (scrollY - y1) / (y2 - y1);
      } else if (scrollY < y3) {
        targetPhase = 2.0 + (scrollY - y2) / (y3 - y2);
      } else {
        const extra = Math.min(1.0, (scrollY - y3) / Math.max(1, vh * 0.5));
        targetPhase = 3.0 + extra * 0.15;
      }

      requestRender();
    };

    // Ultra-fast bounding-box clipped text masking (~1,500 iterations, <0.04ms execution)
    const updateTextMask = () => {
      if (cols <= 0 || rows <= 0 || W <= 0 || H <= 0) {
        hasTextMask = false;
        return;
      }
      const selectors = [
        '.hero-avatar-col',
        '.hero-name',
        '.hero-role',
        '.hero-lead',
        '.hero-text-links',
        '.section-head',
        '.tech-ledger',
        '.exp-ledger',
        '.projects-ledger',
        '.gallery-grid',
        '.contact-split',
      ];

      const nameEl = document.querySelector<HTMLElement>('.hero-name');
      if (nameEl) {
        const nr = nameEl.getBoundingClientRect();
        cachedNameRect = { left: nr.left, top: nr.top, right: nr.right, bottom: nr.bottom };
      }
      const avatarEl = document.querySelector<HTMLElement>('.hero-avatar-col');
      if (avatarEl) {
        const ar = avatarEl.getBoundingClientRect();
        cachedAvatarRect = { left: ar.left, top: ar.top, right: ar.right, bottom: ar.bottom };
      }

      const rawRects: DOMRect[] = [];
      for (let s = 0; s < selectors.length; s++) {
        const els = document.querySelectorAll<HTMLElement>(selectors[s]);
        for (let i = 0; i < els.length; i++) {
          const r = els[i].getBoundingClientRect();
          if (r.bottom >= -20 && r.top <= H + 20 && r.right >= 0 && r.left <= W) {
            rawRects.push(r);
          }
        }
      }

      if (rawRects.length === 0) {
        hasTextMask = false;
        return;
      }

      if (textMask.length !== totalCells) {
        textMask = new Float32Array(totalCells);
      }
      textMask.fill(1.0);

      const feather = 24;
      const minMask = 0.0; // Negative space masking directly over readable typography

      for (let i = 0; i < rawRects.length; i++) {
        const r = rawRects[i];
        const boxX0 = r.left - 10;
        const boxY0 = r.top - 6;
        const boxX1 = r.right + 10;
        const boxY1 = r.bottom + 6;

        const c0 = Math.max(0, Math.floor((boxX0 - feather) / cw));
        const c1 = Math.min(cols - 1, Math.ceil((boxX1 + feather) / cw));
        const r0 = Math.max(0, Math.floor((boxY0 - feather) / ch));
        const r1 = Math.min(rows - 1, Math.ceil((boxY1 + feather) / ch));

        for (let y = r0; y <= r1; y++) {
          const Y = y * ch + ch / 2;
          const rowOffset = y * cols;
          for (let x = c0; x <= c1; x++) {
            const X = x * cw + cw / 2;
            const dx = Math.max(boxX0 - X, 0, X - boxX1);
            const dy = Math.max(boxY0 - Y, 0, Y - boxY1);
            const d = (dx === 0 && dy === 0) ? 0 : Math.hypot(dx, dy);
            if (d < feather) {
              const factor = d === 0 ? minMask : lerp(minMask, 1.0, ease(d / feather));
              const idx = rowOffset + x;
              if (factor < textMask[idx]) {
                textMask[idx] = factor;
              }
            }
          }
        }
      }

      hasTextMask = true;
      requestRender();
    };

    const handleResize = () => {
      if (!container || !canvas) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;

      if (W <= 0 || H <= 0) return;

      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);

      if (W < 600) {
        CS = 10;
      } else if (W > 2400) {
        CS = Math.max(12, Math.round(W / 180));
      } else {
        CS = 12;
      }
      cw = CS * 0.6;
      ch = CS;
      cols = Math.min(220, Math.max(1, Math.ceil(W / cw)));
      rows = Math.min(160, Math.max(1, Math.ceil(H / ch)));
      totalCells = cols * rows;

      cellL = new Float32Array(totalCells);
      cellChar = new Int32Array(totalCells);
      textMask = new Float32Array(totalCells);

      off.width = cols;
      off.height = rows;
      o.imageSmoothingQuality = 'high';

      measureSectionPositions();
      updateTextMask();
      buildDotLayer();
      updateScrollProgress();
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });

    const resizeObserver = new ResizeObserver(() => {
      measureSectionPositions();
      updateTextMask();
      updateScrollProgress();
    });
    resizeObserver.observe(container);
    const mainWrap = document.querySelector('.site-wrapper');
    if (mainWrap) {
      resizeObserver.observe(mainWrap);
    }

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (isMounted) {
          measureSectionPositions();
          updateTextMask();
          updateScrollProgress();
        }
      });
    }

    const handleWindowLoad = () => {
      if (isMounted) {
        measureSectionPositions();
        updateTextMask();
        updateScrollProgress();
      }
    };
    window.addEventListener('load', handleWindowLoad, { passive: true });

    updateScrollProgress();
    smoothPhase = targetPhase;

    const handleScroll = () => {
      updateScrollProgress();
      updateTextMask();
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Register Lenis listener for synchronous zero-latency animation frame delivery if present
    const maybeLenis = (window as any).lenis;
    if (maybeLenis && typeof maybeLenis.on === 'function') {
      maybeLenis.on('scroll', handleScroll);
    }

    const handlePointerMove = (e: PointerEvent) => {
      const rawX = e.clientX / window.innerWidth - 0.5;
      const rawY = e.clientY / window.innerHeight - 0.5;
      targetMx = cl(rawX, -0.6, 0.6);
      targetMy = cl(rawY, -0.6, 0.6);

      mousePixelX = e.clientX;
      mousePixelY = e.clientY;
      requestRender();
    };

    const handlePointerReset = () => {
      targetMx = 0;
      targetMy = 0;
      mousePixelX = -1000;
      mousePixelY = -1000;
      requestRender();
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerReset, { passive: true });
    window.addEventListener('pointerup', handlePointerReset, { passive: true });

    const handlePointerDown = (e: PointerEvent) => {
      if (e.clientY <= window.innerHeight) {
        touchImpulse = 1.0;
        requestRender();
      }
    };
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisibleRef.current = entry.isIntersecting;
          if (entry.isIntersecting) {
            startLoop();
          } else {
            stopLoop();
          }
        });
      },
      { threshold: 0 }
    );
    observer.observe(container);

    const t0 = performance.now();

    // Helper drawing primitives directly onto the cell grid
    const writeStr = (str: string, startX: number, startY: number, lum: number = 0.85) => {
      if (startY < 0 || startY >= rows) return;
      for (let i = 0; i < str.length; i++) {
        const x = startX + i;
        if (x >= 0 && x < cols) {
          const idx = startY * cols + x;
          cellL[idx] = Math.max(cellL[idx], lum);
          cellChar[idx] = str.charCodeAt(i);
        }
      }
    };

    const drawHLine = (x0: number, x1: number, y: number, chStr: string = '-', lum: number = 0.65) => {
      if (y < 0 || y >= rows) return;
      const minX = Math.max(0, Math.min(x0, x1));
      const maxX = Math.min(cols - 1, Math.max(x0, x1));
      const code = chStr.charCodeAt(0);
      for (let x = minX; x <= maxX; x++) {
        const idx = y * cols + x;
        cellL[idx] = Math.max(cellL[idx], lum);
        cellChar[idx] = code;
      }
    };

    const drawVLine = (x: number, y0: number, y1: number, chStr: string = '|', lum: number = 0.65) => {
      if (x < 0 || x >= cols) return;
      const minY = Math.max(0, Math.min(y0, y1));
      const maxY = Math.min(rows - 1, Math.max(y0, y1));
      const code = chStr.charCodeAt(0);
      for (let y = minY; y <= maxY; y++) {
        const idx = y * cols + x;
        cellL[idx] = Math.max(cellL[idx], lum);
        cellChar[idx] = code;
      }
    };

    const drawBresenham = (
      x0: number,
      y0: number,
      x1: number,
      y1: number,
      lum: number = 0.75,
      customCh?: string
    ) => {
      let x = Math.round(x0);
      let y = Math.round(y0);
      const targetX = Math.round(x1);
      const targetY = Math.round(y1);
      const dx = Math.abs(targetX - x);
      const dy = Math.abs(targetY - y);
      const sx = x < targetX ? 1 : -1;
      const sy = y < targetY ? 1 : -1;
      let err = dx - dy;

      let defaultCh = '-';
      if (dx === 0) {
        defaultCh = '|';
      } else if (dy === 0) {
        defaultCh = '-';
      } else {
        const slope = dy / dx;
        if (slope < 0.45) {
          defaultCh = '-';
        } else if (slope > 2.2) {
          defaultCh = '|';
        } else {
          defaultCh = sx === sy ? '\\' : '/';
        }
      }
      const code = (customCh || defaultCh).charCodeAt(0);

      while (true) {
        if (x >= 0 && x < cols && y >= 0 && y < rows) {
          const idx = y * cols + x;
          cellL[idx] = Math.max(cellL[idx], lum);
          cellChar[idx] = code;
        }
        if (x === targetX && y === targetY) break;
        const e2 = 2 * err;
        if (e2 > -dy) {
          err -= dy;
          x += sx;
        }
        if (e2 < dx) {
          err += dx;
          y += sy;
        }
      }
    };

    // Smooth bell curves / hermite weights centered at 0.0, 1.0, 2.0, 3.0
    // Width 0.85 ensures adjacent phases cleanly isolate with zero bleed at phase centers (e.g. Phase 0 Hero is 100% pure at scroll 0)
    const calcWeight = (val: number, center: number, width: number = 0.85) => {
      const d = Math.abs(val - center);
      if (d >= width) return 0;
      const q = 1 - d / width;
      return q * q * (3 - 2 * q); // smoothstep
    };

    render = (now: number) => {
      if (!isMounted || !isVisibleRef.current) {
        stopLoop();
        return;
      }

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        isRunning = false;
      }

      if (!leftLoaded || !rightLoaded || cols <= 0 || rows <= 0 || W <= 0 || H <= 0) return;

      const isActivelyInteracting =
        forceNextRender ||
        Math.abs(targetPhase - smoothPhase) > 0.003 ||
        Math.abs(targetMx - mx) > 0.003 ||
        Math.abs(targetMy - my) > 0.003 ||
        touchImpulse > 0.01;

      const minInterval = isActivelyInteracting ? 15 : 45;
      if (!forceNextRender && now - lastRenderTime < minInterval) return;
      lastRenderTime = now;
      forceNextRender = false;

      const t = (now - t0) / 1000;
      smoothPhase = prefersReducedMotion ? targetPhase : smoothPhase + (targetPhase - smoothPhase) * 0.09;
      mx = prefersReducedMotion ? 0 : mx + (targetMx - mx) * 0.12;
      my = prefersReducedMotion ? 0 : my + (targetMy - my) * 0.12;

      if (touchImpulse > 0) {
        touchImpulse = Math.max(0, touchImpulse - 0.035);
      }

      const isDark = themeRef.current !== 'light';

      // Clear cell unified buffers
      cellL.fill(0);
      cellChar.fill(-1);

      // Phase blending weights (C1 continuous hermite smoothstep)
      // Width 0.80 ensures adjacent phases cleanly isolate at phase centers (e.g. Phase 0 Hero is 100% pure at scroll 0)
      let w0 = calcWeight(smoothPhase, 0.0, 0.80);
      let w1 = calcWeight(smoothPhase, 1.0, 0.80);
      let w2 = calcWeight(smoothPhase, 2.0, 0.80);
      let w3 = calcWeight(smoothPhase, 3.0, 0.80);
      const sumW = w0 + w1 + w2 + w3 || 1;
      w0 /= sumW;
      w1 /= sumW;
      w2 /= sumW;
      w3 /= sumW;

      const t8 = Math.floor(t * 8);

      // ─────────────────────────────────────────────────────────────
      // PHASE 1: Hero Michelangelo Hands (Creation of Adam)
      // ─────────────────────────────────────────────────────────────
      if (w0 > 0.005) {
        const app = lerp(0.72, 1, ease(cl(smoothPhase / 0.45)));
        const dis = ease(cl((smoothPhase - 0.45) / 0.40)) * 0.9;

        const isMobile = W < 768;
        const isTabletPortrait = W >= 768 && W < 860;

        // Anatomical bounds in HANDS_META (516x272):
        // Hand anatomy occupies Y: 60 to 210 (active height: 150px).
        // Fingertip meeting baseline is at Y = 140.42.
        // Upper reach above fingertips: 80.42px. Lower reach below fingertips: 69.58px.
        // Full width: 516px (Left split: 268px, Right split: 248px).

        let kpx: number;
        let focalPixelX: number;
        let focalPixelY: number;

        if (isMobile) {
          const contentTop = cachedAvatarRect && cachedAvatarRect.top > 0 ? cachedAvatarRect.top : Math.max(130, H * 0.16);
          const topMargin = 16;
          const availH = Math.max(70, contentTop - topMargin - 10);
          const maxKpxByW = (W - 32) / HANDS_META.W;
          const maxKpxByH = availH / 150;
          kpx = Math.max(0.55, Math.min(0.72, Math.min(maxKpxByW, maxKpxByH)));

          focalPixelX = W * 0.5;
          const activeH = 150 * kpx;
          const remSpace = Math.max(0, availH - activeH);
          focalPixelY = topMargin + 80.42 * kpx + remSpace * 0.5;
        } else if (isTabletPortrait) {
          const contentTop = cachedAvatarRect && cachedAvatarRect.top > 0 ? cachedAvatarRect.top : Math.max(160, H * 0.18);
          const topMargin = 20;
          const availH = Math.max(90, contentTop - topMargin - 12);
          const maxKpxByW = (W - 48) / HANDS_META.W;
          const maxKpxByH = availH / 150;
          kpx = Math.max(0.75, Math.min(0.95, Math.min(maxKpxByW, maxKpxByH)));

          focalPixelX = W * 0.5;
          const activeH = 150 * kpx;
          const remSpace = Math.max(0, availH - activeH);
          focalPixelY = topMargin + 80.42 * kpx + remSpace * 0.5;
        } else {
          // Desktop: position hands in the generous negative space above the primary hero heading
          const nameTop = cachedNameRect && cachedNameRect.top > 0 ? cachedNameRect.top : Math.max(220, H * 0.22);
          const topMargin = 22;
          const availH = Math.max(120, nameTop - topMargin - 16);
          const maxKpxByW = (W - 64) / HANDS_META.W;
          const maxKpxByH = availH / 150;
          kpx = Math.max(0.92, Math.min(1.28, Math.min(maxKpxByW, maxKpxByH)));

          focalPixelX = W * 0.5;
          const activeH = 150 * kpx;
          const remSpace = Math.max(0, availH - activeH);
          focalPixelY = topMargin + 80.42 * kpx + remSpace * 0.5;
        }

        const sx = kpx / cw;
        const sy = kpx / ch;
        const focalCellX = focalPixelX / cw;
        const focalCellY = focalPixelY / ch;

        // Symmetric origin centered at midpoint between Adam and God fingertips
        const ox = focalCellX - HANDS_META.split * sx;
        const oy = focalCellY - 140.42 * sy + my * 1.5;

        // Fingertip convergence gap: closes smoothly as phase progresses
        const g = lerp(cols * 0.035, 0, app) + dis * cols * 0.08;
        const fl = prefersReducedMotion ? 0 : Math.sin(t * 0.85) * 0.45;
        const fr = prefersReducedMotion ? 0 : Math.sin(t * 0.85 + 2) * 0.45;
        const par = mx * 2.2;

        o.globalCompositeOperation = 'source-over';
        o.fillStyle = '#000';
        o.fillRect(0, 0, cols, rows);
        o.globalCompositeOperation = 'lighter';

        const drawHalf = (img: HTMLImageElement, x0: number, dx: number, dy: number) => {
          o.save();
          o.translate(ox + dx + par, oy + dy);
          o.scale(sx, sy);
          o.drawImage(img, x0, 0);
          o.restore();
        };

        drawHalf(imgL, 0, -g, fl);
        drawHalf(imgR, HANDS_META.split, g, fr);

        const imgData = o.getImageData(0, 0, cols, rows).data;

        for (let y = 0; y < rows; y++) {
          const rowOffset = y * cols;
          for (let x = 0; x < cols; x++) {
            const cellIdx = rowOffset + x;
            const raw = imgData[cellIdx << 2];
            // Threshold gate eliminates JPEG compression noise & downsampling blur between fingers
            if (raw >= 26 && (dis === 0 || hash(x, y, 5) >= dis)) {
              const norm = (raw - 26) / (255 - 26);
              // Contrast S-curve: cleanly isolates fingers, preserves knuckles and tendons
              const contrast = norm * norm * (3 - 2 * norm);
              const rawL = Math.pow(contrast, 1.15);
              cellL[cellIdx] += rawL * w0;
            } else if (dis > 0) {
              // Binary dust rain
              const c = hash(x, 0, 3);
              const h = (t * (6 + c * 14) + c * rows * 3) % (rows * 1.8);
              const d = y - h;
              if (d < 0 && d > -10) {
                const rain = (1 + d / 10) * dis * 0.55 * w0;
                if (rain > cellL[cellIdx]) {
                  cellL[cellIdx] = rain;
                  cellChar[cellIdx] = hash(x, y, t8) < 0.5 ? 48 : 49; // '0' or '1'
                }
              }
            }
          }
        }
      }

      // ─────────────────────────────────────────────────────────────
      // PHASE 2: Stack & Tech — Microcontroller & PCB Schematic (STM32/ESP32)
      // ─────────────────────────────────────────────────────────────
      if (w1 > 0.005) {
        const isMobile = W < 768;
        const icCenterX = Math.round(cols * (isMobile ? 0.5 : 0.65));
        const icCenterY = Math.round(rows * 0.48);
        const icW = Math.min(Math.max(isMobile ? 18 : 24, Math.round(cols * 0.26)), 28);
        const icH = Math.min(Math.max(12, Math.round(rows * 0.32)), 16);

        const x0 = icCenterX - Math.floor(icW / 2);
        const x1 = x0 + icW;
        const y0 = icCenterY - Math.floor(icH / 2);
        const y1 = y0 + icH;

        // IC Chip Outer Outline
        drawHLine(x0, x1, y0, '-', 0.85 * w1);
        drawHLine(x0, x1, y1, '-', 0.85 * w1);
        drawVLine(x0, y0, y1, '|', 0.85 * w1);
        drawVLine(x1, y0, y1, '|', 0.85 * w1);

        // IC Corners & Pin 1 Index Mark
        const codeCorner = '+'.charCodeAt(0);
        if (y0 >= 0 && y0 < rows) {
          if (x0 >= 0 && x0 < cols) { cellL[y0 * cols + x0] = 0.9 * w1; cellChar[y0 * cols + x0] = codeCorner; }
          if (x1 >= 0 && x1 < cols) { cellL[y0 * cols + x1] = 0.9 * w1; cellChar[y0 * cols + x1] = codeCorner; }
        }
        if (y1 >= 0 && y1 < rows) {
          if (x0 >= 0 && x0 < cols) { cellL[y1 * cols + x0] = 0.9 * w1; cellChar[y1 * cols + x0] = codeCorner; }
          if (x1 >= 0 && x1 < cols) { cellL[y1 * cols + x1] = 0.9 * w1; cellChar[y1 * cols + x1] = codeCorner; }
        }
        // Pin 1 Index Notch
        if (y0 + 1 < rows && x0 + 1 < cols) {
          cellL[(y0 + 1) * cols + (x0 + 1)] = 0.95 * w1;
          cellChar[(y0 + 1) * cols + (x0 + 1)] = 'o'.charCodeAt(0);
        }

        // IC Markings
        const label1 = isMobile ? 'STM32F4' : 'STM32F401RE';
        const label2 = isMobile ? 'ARM-M4' : 'ARM CORTEX-M4';
        const label3 = '[ 84 MHz ]';
        const label4 = '[ USB-HID ]';

        writeStr(label1, Math.round(icCenterX - label1.length / 2), y0 + 2, 0.92 * w1);
        writeStr(label2, Math.round(icCenterX - label2.length / 2), y0 + 4, 0.80 * w1);
        writeStr(label3, Math.round(icCenterX - label3.length / 2), y0 + 6, 0.70 * w1);
        if (icH >= 13) {
          writeStr(label4, Math.round(icCenterX - label4.length / 2), y0 + 8, 0.65 * w1);
        }

        // IC Pinouts & Extended Traces
        const leftPins = ['VDD', 'PA0', 'PA1', 'PA2', 'PA3', 'NRST', 'GND', 'OSC'];
        const rightPins = ['3V3', 'SWDIO', 'SWCLK', 'PB6', 'PB7', 'USB-', 'USB+', 'GND'];

        const maxPins = Math.min(leftPins.length, icH - 2);
        for (let pIdx = 0; pIdx < maxPins; pIdx++) {
          const pinY = y0 + 1 + pIdx;
          if (pinY >= y1) break;

          // Left Pin Stub
          drawHLine(x0 - 2, x0, pinY, '=', 0.8 * w1);
          const lPinName = leftPins[pIdx];
          if (!isMobile && x0 - 3 - lPinName.length >= 0) {
            writeStr(lPinName, x0 - 2 - lPinName.length, pinY, 0.65 * w1);
          }

          // Left Copper Bus Route
          const traceLen = isMobile ? 14 + (pIdx % 3) * 6 : Math.min(x0 - 4, Math.round(cols * 0.28) + (pIdx % 3) * 8);
          const trEndX = Math.max(2, x0 - 3 - (isMobile ? 2 : lPinName.length + 1) - traceLen);
          drawHLine(trEndX, x0 - 3 - (isMobile ? 2 : lPinName.length + 1), pinY, '-', 0.55 * w1);

          // Animated pulse along left trace
          const pulseOffsetL = (t * (10 + pIdx * 2.5)) % (traceLen + 6);
          const pulseXL = Math.round(x0 - 5 - pulseOffsetL);
          if (pulseXL >= trEndX && pulseXL < cols && pinY >= 0 && pinY < rows) {
            const pIdxCell = pinY * cols + pulseXL;
            cellL[pIdxCell] = Math.max(cellL[pIdxCell], 0.95 * w1);
            cellChar[pIdxCell] = (pulseOffsetL % 2 === 0 ? '<' : '*').charCodeAt(0);
          }

          // Right Pin Stub
          drawHLine(x1, x1 + 2, pinY, '=', 0.8 * w1);
          const rPinName = rightPins[pIdx];
          if (!isMobile && x1 + 3 + rPinName.length < cols) {
            writeStr(rPinName, x1 + 3, pinY, 0.65 * w1);
          }

          // Right Copper Bus Route with 45-degree angled fanouts
          const fanoutStartX = x1 + 3 + (isMobile ? 2 : rPinName.length + 1);
          const trLenR = 12 + ((pIdx + 1) % 3) * 8;
          const trMidX = fanoutStartX + 6;
          const trEndY = cl(pinY + (pIdx < 4 ? -2 : 2), 0, rows - 1);
          drawHLine(fanoutStartX, trMidX, pinY, '-', 0.55 * w1);
          drawBresenham(trMidX, pinY, trMidX + 3, trEndY, 0.6 * w1);
          drawHLine(trMidX + 3, Math.min(cols - 2, trMidX + 3 + trLenR), trEndY, '-', 0.55 * w1);

          // Animated pulse along right trace
          const pulseOffsetR = (t * (12 + pIdx * 2)) % (trLenR + 9);
          const pulseXR = Math.round(fanoutStartX + pulseOffsetR);
          if (pulseXR < cols) {
            let currentY = pinY;
            if (pulseXR > trMidX + 3) {
              currentY = trEndY;
            } else if (pulseXR >= trMidX) {
              currentY = Math.round(lerp(pinY, trEndY, (pulseXR - trMidX) / 3));
            }
            if (currentY >= 0 && currentY < rows) {
              const pIdxCell = currentY * cols + pulseXR;
              if (pIdxCell >= 0 && pIdxCell < totalCells) {
                cellL[pIdxCell] = Math.max(cellL[pIdxCell], 0.95 * w1);
                cellChar[pIdxCell] = (pulseOffsetR % 2 === 0 ? '>' : '*').charCodeAt(0);
              }
            }
          }
        }

        // SMD Passives & Peripherals
        if (!isMobile) {
          // Quartz Crystal Oscillator
          const xtalX = Math.min(cols - 16, x1 + 18);
          const xtalY = y0 + 2;
          writeStr('[=16.000MHz=]', xtalX, xtalY, 0.72 * w1);

          // Decoupling Capacitors
          writeStr('-[||]-', xtalX + 2, xtalY + 3, 0.62 * w1);
          writeStr('GND', xtalX + 9, xtalY + 3, 0.55 * w1);

          // Blinking Status LED
          const isLedOn = Math.sin(t * 8) > 0;
          writeStr(`-[|>|]-${isLedOn ? '*' : ' '}`, xtalX, xtalY + 6, (isLedOn ? 0.95 : 0.5) * w1);
          writeStr('PWR/STAT', xtalX + 9, xtalY + 6, 0.55 * w1);

          // SWD Debug Header
          writeStr('[ * * * * ] SWD', xtalX, xtalY + 9, 0.65 * w1);
        }

        // Interactive Logic Probe Status Tooltip on Mouse Proximity
        const mouseCellX = mousePixelX >= 0 ? mousePixelX / cw : -1000;
        const mouseCellY = mousePixelY >= 0 ? mousePixelY / ch : -1000;
        if (
          mouseCellX >= x0 - 10 &&
          mouseCellX <= x1 + 20 &&
          mouseCellY >= y0 - 3 &&
          mouseCellY <= y1 + 3
        ) {
          const probeText = '[LOGIC PROBE: 3.3V HIGH · 84.000 MHz OK]';
          writeStr(probeText, Math.max(2, Math.round(icCenterX - probeText.length / 2)), y0 - 2, 0.95 * w1);
        }
      }

      // ─────────────────────────────────────────────────────────────
      // PHASE 3: Experience & Projects — 3D Rotating Wireframe & Oscilloscope
      // ─────────────────────────────────────────────────────────────
      if (w2 > 0.005) {
        const isMobile = W < 768;

        // 1. 3D Rotating Polyhedron Wireframe
        const center3dX = cols * (isMobile ? 0.5 : 0.68);
        const center3dY = rows * (isMobile ? 0.38 : 0.36);
        const scale3d = Math.min(cols, rows) * (isMobile ? 0.22 : 0.25);
        const camDist = 3.6;

        const rx = t * 0.45 + my * 1.4;
        const ry = t * 0.65 + mx * 1.4;
        const rz = t * 0.22;

        const cx_rot = Math.cos(rx), sx_rot = Math.sin(rx);
        const cy_rot = Math.cos(ry), sy_rot = Math.sin(ry);
        const cz_rot = Math.cos(rz), sz_rot = Math.sin(rz);

        for (let i = 0; i < 14; i++) {
          const [vx, vy, vz] = VERTICES_3D[i];
          // Euler Rotation X
          const y1 = vy * cx_rot - vz * sx_rot;
          const z1 = vy * sx_rot + vz * cx_rot;
          // Euler Rotation Y
          const x2 = vx * cy_rot + z1 * sy_rot;
          const z2 = -vx * sy_rot + z1 * cy_rot;
          // Euler Rotation Z
          const x3 = x2 * cz_rot - y1 * sz_rot;
          const y3 = x2 * sz_rot + y1 * cz_rot;

          const sz = z2 + camDist;
          projZ[i] = z2;
          projX[i] = center3dX + (x3 / sz) * scale3d * 1.7; // 1.7 aspect ratio compensation
          projY[i] = center3dY + (y3 / sz) * scale3d;
        }

        // Draw 3D Edges with depth shading
        for (let e = 0; e < EDGES_3D.length; e++) {
          const [i0, i1] = EDGES_3D[e];
          const depthAvg = (projZ[i0] + projZ[i1]) * 0.5;
          const edgeLum = cl(0.4 + (depthAvg + 1.5) * 0.18, 0.25, 0.95) * w2;
          drawBresenham(projX[i0], projY[i0], projX[i1], projY[i1], edgeLum);
        }

        // Draw 3D Vertices
        for (let i = 0; i < 14; i++) {
          const vx = Math.round(projX[i]);
          const vy = Math.round(projY[i]);
          if (vx >= 0 && vx < cols && vy >= 0 && vy < rows) {
            const vIdx = vy * cols + vx;
            cellL[vIdx] = Math.max(cellL[vIdx], 0.98 * w2);
            cellChar[vIdx] = (projZ[i] > 0 ? '*' : 'o').charCodeAt(0);
          }
        }

        // 2. Dual-Channel Oscilloscope Waveform & Signal Graticule
        const oscY = Math.round(rows * (isMobile ? 0.72 : 0.66));
        const oscX0 = Math.max(2, Math.round(cols * (isMobile ? 0.05 : 0.15)));
        const oscX1 = Math.min(cols - 3, Math.round(cols * (isMobile ? 0.95 : 0.88)));

        // DSO Telemetry Header
        const dsoHeader = isMobile
          ? 'DSO [CH1: 500mV  TRIG: AUTO]'
          : 'DSO-84M [CH1: 500mV/div  CH2: 3.3V  TB: 10us  TRIG: AUTO [OK]  f: 48.00 MHz]';
        writeStr(dsoHeader, oscX0, oscY - 6, 0.70 * w2);

        // DSO Graticule Grid (subtle crosshair dots every 8 cols, 3 rows)
        for (let gy = oscY - 5; gy <= oscY + 5; gy += 2) {
          for (let gx = oscX0; gx <= oscX1; gx += 6) {
            if (gx < cols && gy >= 0 && gy < rows) {
              const gIdx = gy * cols + gx;
              if (cellL[gIdx] < 0.12) {
                cellL[gIdx] = 0.12 * w2;
                cellChar[gIdx] = (gx === Math.round((oscX0 + oscX1) / 2) || gy === oscY ? '+' : '·').charCodeAt(0);
              }
            }
          }
        }

        // Channel 1: Analog Modulated Waveform
        const amp1 = isMobile ? 3.2 : 4.0;
        for (let x = oscX0; x <= oscX1; x++) {
          const wave =
            Math.sin(x * 0.08 + t * 4.2) * 0.68 +
            Math.cos(x * 0.035 - t * 2.1) * 0.32;
          const y = Math.round(oscY + wave * amp1);
          if (y >= 0 && y < rows) {
            const idx = y * cols + x;
            cellL[idx] = Math.max(cellL[idx], 0.90 * w2);
            cellChar[idx] = '~'.charCodeAt(0);
          }
        }

        // Channel 2: Digital Clock / PWM Square Wave
        const pwmPeriod = 16;
        for (let x = oscX0; x <= oscX1; x++) {
          const phase = ((x + t * 28) % pwmPeriod + pwmPeriod) % pwmPeriod;
          const isHigh = phase < pwmPeriod * 0.5;
          const y = oscY + (isHigh ? -3 : 3);
          if (y >= 0 && y < rows) {
            const idx = y * cols + x;
            cellL[idx] = Math.max(cellL[idx], 0.65 * w2);
            cellChar[idx] = '-'.charCodeAt(0);
          }
          const isEdge = phase === 0 || Math.floor(phase) === Math.floor(pwmPeriod * 0.5);
          if (isEdge) {
            for (let ey = oscY - 3; ey <= oscY + 3; ey++) {
              if (ey >= 0 && ey < rows) {
                const eIdx = ey * cols + x;
                cellL[eIdx] = Math.max(cellL[eIdx], 0.75 * w2);
                cellChar[eIdx] = '|'.charCodeAt(0);
              }
            }
          }
        }
      }

      // ─────────────────────────────────────────────────────────────
      // PHASE 4: Contact & Telemetry — Low-Frequency Pulse & Radar Baseline
      // ─────────────────────────────────────────────────────────────
      if (w3 > 0.005) {
        const isMobile = W < 768;
        const pulseY = Math.round(rows * 0.65);
        const xStart = Math.max(2, Math.round(cols * 0.06));
        const xEnd = Math.min(cols - 3, Math.round(cols * 0.94));

        // Horizontal Baseline with quiet carrier dots
        for (let x = xStart; x <= xEnd; x++) {
          const idx = pulseY * cols + x;
          if (cellL[idx] < 0.14) {
            cellL[idx] = 0.14 * w3;
            cellChar[idx] = '·'.charCodeAt(0);
          }
        }

        // Soliton / Heartbeat pulse moving smoothly across the baseline
        const pulseCycle = (t * 16) % (xEnd - xStart + 24);
        const pulseCenterX = xStart + pulseCycle - 12;

        for (let dx = -10; dx <= 10; dx++) {
          const px = Math.round(pulseCenterX + dx);
          if (px >= xStart && px <= xEnd) {
            // Bi-phasic QRS deflection
            const dy =
              -4.5 * Math.exp(-(dx * dx) / 5) +
              2.2 * Math.exp(-((dx - 2.8) * (dx - 2.8)) / 3.5) -
              1.4 * Math.exp(-((dx + 2.8) * (dx + 2.8)) / 3.5);

            const py = Math.round(pulseY + dy);
            if (py >= 0 && py < rows) {
              const idx = py * cols + px;
              cellL[idx] = Math.max(cellL[idx], 0.95 * w3);
              let pChar = '-';
              if (dy < -2.0) {
                pChar = '^';
              } else if (dy < -0.8) {
                pChar = dx < 0 ? '/' : '\\';
              } else if (dy > 0.8) {
                pChar = 'v';
              }
              cellChar[idx] = pChar.charCodeAt(0);
            }
          }
        }

        // Expanding concentric radar ripples around current pulse position
        const rippleRad = (t * 8) % 20;
        const rippleFade = 1.0 - rippleRad / 20;
        if (rippleFade > 0.05) {
          for (let a = 0; a < 16; a++) {
            const ang = (a / 16) * Math.PI * 2;
            const rx = Math.round(pulseCenterX + Math.cos(ang) * rippleRad * 1.8);
            const ry = Math.round(pulseY + Math.sin(ang) * rippleRad);
            if (rx >= xStart && rx <= xEnd && ry >= 0 && ry < rows) {
              const rIdx = ry * cols + rx;
              cellL[rIdx] = Math.max(cellL[rIdx], 0.35 * rippleFade * w3);
              cellChar[rIdx] = '·'.charCodeAt(0);
            }
          }
        }

        // Serene Terminal Telemetry Readout
        const line1 = isMobile
          ? 'STATUS: CARRIER READY · ADANA TR'
          : 'STATUS: CARRIER READY · LAT: 37.0000°N  LON: 35.3213°E · TX: IDLE';
        const line2 = isMobile
          ? 'PING: 1ms · END TRANSMISSION'
          : 'PACKETS: 0042 · LOSS: 0.00% · LINK: 100% · PING: 1ms · END TRANSMISSION';

        writeStr(line1, xStart, pulseY + 4, 0.72 * w3);
        writeStr(line2, xStart, pulseY + 6, 0.58 * w3);
      }

      // ─────────────────────────────────────────────────────────────
      // COMPOSITING & BATCHED RENDER
      // ─────────────────────────────────────────────────────────────
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      // Blit pre-rendered background dot matrix in 1 single GPU operation
      if (dotLayer.width > 0 && dotLayer.height > 0) {
        ctx.drawImage(dotLayer, 0, 0, W, H);
      }

      ctx.font = `${CS - 1}px "Geist Mono", ui-monospace, Menlo, Consolas, monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for (let b = 0; b < 7; b++) {
        bucketsX[b].length = 0;
        bucketsY[b].length = 0;
        bucketsChar[b].length = 0;
      }

      const mouseCellX = mousePixelX >= 0 ? mousePixelX / cw : -1000;
      const mouseCellY = mousePixelY >= 0 ? mousePixelY / ch : -1000;

      for (let y = 0; y < rows; y++) {
        const Y = y * ch + ch / 2;
        const rowOffset = y * cols;
        for (let x = 0; x < cols; x++) {
          const cellIdx = rowOffset + x;
          let l = cellL[cellIdx];
          if (l < 0.04) continue;

          const X = x * cw + cw / 2;

          // Interactive mouse proximity phosphor glow with fast bounding-box test
          if (mouseCellX >= 0) {
            const mDx = Math.abs(x - mouseCellX);
            const mDy = Math.abs(y - mouseCellY);
            if (mDx < 12 && mDy < 12) {
              const mDist = Math.hypot(mDx, mDy);
              if (mDist < 12) {
                const mBoost = Math.pow(1 - mDist / 12, 1.4) * 0.45;
                l = Math.min(1.0, l + mBoost);
              }
            }
          }

          // Smoothly attenuate luminance directly behind readable typography
          if (hasTextMask) {
            l *= textMask[cellIdx];
          }

          if (l > 0.05) {
            const bucketScale = hasTextMask ? lerp(5.2, 7, textMask[cellIdx]) : 7;
            const bucketIdx = Math.min(6, Math.max(0, Math.floor(l * bucketScale)));
            const charBucketIdx = Math.min(6, Math.max(0, Math.floor(l * 7)));

            let charToDraw = '';
            const explicitCode = cellChar[cellIdx];

            if (explicitCode >= 32) {
              charToDraw = String.fromCharCode(explicitCode);
            } else {
              const arr = LV[charBucketIdx];
              charToDraw = arr[(x * 5 + y * 11) % arr.length];
            }

            // Do not push blank spaces to draw buckets
            if (charToDraw !== ' ') {
              bucketsX[bucketIdx].push(X);
              bucketsY[bucketIdx].push(Y);
              bucketsChar[bucketIdx].push(charToDraw);
            }
          }
        }
      }

      // Render active ASCII cells batched into 7 monochrome luminance levels
      for (let b = 0; b < 7; b++) {
        const xs = bucketsX[b];
        const count = xs.length;
        if (count === 0) continue;
        const ys = bucketsY[b];
        const chars = bucketsChar[b];
        const midL = (b + 0.5) / 7;
        if (isDark) {
          const v = Math.round(52 + midL * 164);
          ctx.fillStyle = `rgb(${v}, ${v}, ${Math.min(255, v + 5)})`;
        } else {
          const lightV = Math.round(188 - midL * 138);
          ctx.fillStyle = `rgb(${lightV}, ${lightV}, ${lightV + 4})`;
        }
        for (let i = 0; i < count; i++) {
          ctx.fillText(chars[i], xs[i], ys[i]);
        }
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopLoop();
      } else {
        forceNextRender = true;
        startLoop();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    imgL.onload = () => {
      leftLoaded = true;
      checkReady();
    };
    imgR.onload = () => {
      rightLoaded = true;
      checkReady();
    };

    imgL.src = HAND_IMG_LEFT;
    imgR.src = HAND_IMG_RIGHT;
    if (imgL.complete && imgL.naturalWidth > 0) leftLoaded = true;
    if (imgR.complete && imgR.naturalWidth > 0) rightLoaded = true;
    checkReady();

    return () => {
      isMounted = false;
      stopLoop();
      rebuildDotsRef.current = null;
      imgL.onload = null;
      imgR.onload = null;
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('load', handleWindowLoad);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerReset);
      window.removeEventListener('pointerup', handlePointerReset);
      window.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      const activeLenis = (window as any).lenis;
      if (activeLenis && typeof activeLenis.off === 'function') {
        activeLenis.off('scroll', handleScroll);
      }
      observer.disconnect();
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="hero-ascii-container"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="hero-ascii-canvas" />
    </div>
  );
};

export default AsciiHeroCanvas;
