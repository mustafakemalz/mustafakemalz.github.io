import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { HANDS_META, HAND_IMG_LEFT, HAND_IMG_RIGHT } from './asciiHandsData';

const LV = [
  ['.', '·'],
  ['·', ':', '.'],
  ['-', ':', '+'],
  ['1', '0', '>', 'x'],
  ['X', '$', '1', '0'],
  ['#', '$', 'X', '8'],
  ['@', '&', '%', '8'],
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

export const AsciiHeroCanvas: React.FC = () => {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isVisibleRef = useRef<boolean>(true);
  const themeRef = useRef<string>(theme);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const off = document.createElement('canvas');
    const o = off.getContext('2d', { willReadFrequently: true });
    if (!o) return;

    // Load hands images
    const imgL = new Image();
    const imgR = new Image();
    let isMounted = true;
    let isRunning = false;
    let animationFrameId: number | null = null;
    let leftLoaded = false;
    let rightLoaded = false;
    let render: (now: number) => void;

    let W = 0;
    let H = 0;
    let CS = 13;
    let cw = CS * 0.6;
    let ch = CS;
    let cols = 0;
    let rows = 0;
    let dpr = 1;
    let p = 0;
    let tp = 0;
    let mx = 0;
    let my = 0;
    let targetMx = 0;
    let targetMy = 0;
    let touchImpulse = 0;

    const startLoop = () => {
      if (!isMounted || isRunning || !isVisibleRef.current || !leftLoaded || !rightLoaded || !render) return;
      isRunning = true;
      animationFrameId = requestAnimationFrame(render);
    };

    const stopLoop = () => {
      isRunning = false;
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    };

    const checkReady = () => {
      if (!isMounted || !leftLoaded || !rightLoaded) return;
      startLoop();
    };

    // Track scroll within hero bounds
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = container.parentElement?.offsetHeight || window.innerHeight;
      // Hands touch at ~50-65% scroll through hero, disperse as user leaves hero
      tp = cl(scrollY / (heroHeight * 0.75), 0, 1);
    };

    const handleResize = () => {
      if (!container || !canvas) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = container.clientWidth || window.innerWidth;
      H = container.clientHeight || window.innerHeight;

      if (W <= 0 || H <= 0) return;

      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);

      CS = W < 600 ? 10 : 13;
      cw = CS * 0.6;
      ch = CS;
      cols = Math.max(1, Math.ceil(W / cw));
      rows = Math.max(1, Math.ceil(H / ch));

      off.width = cols;
      off.height = rows;
      o.imageSmoothingQuality = 'high';
      handleScroll();
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);

    handleScroll();
    p = tp;
    window.addEventListener('scroll', handleScroll, { passive: true });

    let attachedLenis: any = null;
    const bindLenis = () => {
      const lenis = (window as any).lenis;
      if (lenis && typeof lenis.on === 'function' && !attachedLenis) {
        attachedLenis = lenis;
        lenis.on('scroll', handleScroll);
      }
    };
    bindLenis();
    const lenisTimer = window.setTimeout(bindLenis, 50);

    // Smooth pointer parallax
    const handlePointerMove = (e: PointerEvent) => {
      const rawX = e.clientX / window.innerWidth - 0.5;
      const rawY = e.clientY / window.innerHeight - 0.5;
      targetMx = cl(rawX, -0.6, 0.6);
      targetMy = cl(rawY, -0.6, 0.6);
    };

    const handlePointerReset = () => {
      targetMx = 0;
      targetMy = 0;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerReset, { passive: true });
    window.addEventListener('pointerup', handlePointerReset, { passive: true });

    // Click/tap pulse wave interaction on hero
    const handlePointerDown = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      if (
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom &&
        e.clientX >= rect.left &&
        e.clientX <= rect.right
      ) {
        touchImpulse = 1.0;
      }
    };

    window.addEventListener('pointerdown', handlePointerDown, { passive: true });

    // Pause RAF completely when hero is scrolled out of viewport
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

    render = (now: number) => {
      if (!isMounted || !isVisibleRef.current) {
        stopLoop();
        return;
      }

      animationFrameId = requestAnimationFrame(render);
      if (!leftLoaded || !rightLoaded || cols <= 0 || rows <= 0 || W <= 0 || H <= 0) return;

      const t = (now - t0) / 1000;
      p += (tp - p) * 0.08;

      // Smooth pointer lerp
      mx += (targetMx - mx) * 0.08;
      my += (targetMy - my) * 0.08;

      if (touchImpulse > 0) {
        touchImpulse = Math.max(0, touchImpulse - 0.03);
      }

      const isDark = themeRef.current !== 'light';

      const app = lerp(0.32, 1, ease(cl(p / 0.62)));
      const dis = ease(cl((p - 0.84) / 0.16)) * 0.9;
      const touchVal = cl((p - 0.6) / 0.08) * (1 - cl((p - 0.84) / 0.1)) + touchImpulse * 0.8;
      const touch = cl(touchVal, 0, 1);

      const scaleFactor = W < 600 ? 1.25 : 1.45;
      const kpx = Math.min((W / HANDS_META.W) * scaleFactor, (H * 0.65) / HANDS_META.H);
      const sx = kpx / cw;
      const sy = kpx / ch;

      const g = lerp(cols * 0.28, 0, app) + dis * cols * 0.08;
      const fl = Math.sin(t * 0.85) * 0.75;
      const fr = Math.sin(t * 0.85 + 2) * 0.75;
      const par = mx * 3.5;

      const ox = cols / 2 - (HANDS_META.W / 2) * sx;
      // Position hands comfortably behind the hero greeting
      const oy = rows * 0.38 - (HANDS_META.H / 2) * sy + my * 2;

      // Offscreen composite
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

      const sp = [
        ox + par + ((HANDS_META.lt[0] + HANDS_META.rt[0]) / 2) * sx,
        oy + ((HANDS_META.lt[1] + HANDS_META.rt[1]) / 2) * sy,
      ];

      const imgData = o.getImageData(0, 0, cols, rows).data;

      // Draw onto visible canvas
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      ctx.font = `${CS - 1}px ui-monospace, Menlo, Consolas, "Cascadia Code", "Geist Mono", monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const X = x * cw + cw / 2;
          const Y = y * ch + ch / 2;
          const l = Math.pow(imgData[(y * cols + x) * 4] / 255, 0.9);

          const on = l > 0.06 && hash(x, y, 5) >= dis;
          let rain = 0;
          if (dis > 0) {
            const c = hash(x, 0, 3);
            const h = (t * (6 + c * 14) + c * rows * 3) % (rows * 1.8);
            const d = y - h;
            if (d < 0 && d > -12) rain = (1 + d / 12) * dis * 0.7;
          }

          if (!on && !rain) {
            // Ambient dot grid
            ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.075)' : 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(X - 0.6, Y - 0.6, 1.25, 1.25);
            continue;
          }

          if (on) {
            const arr = LV[Math.min(6, Math.floor(l * 7))];
            const b = hash(x, y, 9) < 0.1 ? Math.floor(t * 6) : 0;
            const v = Math.round(50 + l * 200);

            if (isDark) {
              ctx.fillStyle = `rgb(${v}, ${v}, ${Math.min(255, v + 8)})`;
            } else {
              const lightV = Math.round(180 - l * 150);
              ctx.fillStyle = `rgb(${lightV}, ${lightV}, ${lightV + 10})`;
            }

            ctx.fillText(arr[Math.floor(hash(x, y, b) * arr.length)], X, Y);
          } else {
            // Matrix rain when dispersing
            if (isDark) {
              ctx.fillStyle = `rgba(180, 205, 230, ${rain * 0.8})`;
            } else {
              ctx.fillStyle = `rgba(30, 40, 70, ${rain * 0.5})`;
            }
            ctx.fillText(hash(x, y, Math.floor(t * 8)) < 0.5 ? '0' : '1', X, Y);
          }
        }
      }

      // Spark ripple at fingertip touch point
      const cx = sp[0] * cw;
      const cy = sp[1] * ch;
      const rr = (t * 130) % 320;

      if (touch > 0) {
        ctx.strokeStyle = isDark
          ? `rgba(255, 255, 255, ${0.45 * touch * (1 - rr / 320)})`
          : `rgba(10, 132, 255, ${0.35 * touch * (1 - rr / 320)})`;
        ctx.lineWidth = 1.2;
        ctx.setLineDash([2, 5]);
        ctx.beginPath();
        ctx.arc(cx, cy, rr, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Soft ambient aura around touch point
      const ga = 0.05 * app + 0.22 * touch;
      if (ga > 0.01) {
        const gr = ctx.createRadialGradient(cx, cy, 0, cx, cy, CS * 14);
        if (isDark) {
          gr.addColorStop(0, `rgba(255, 255, 255, ${ga})`);
          gr.addColorStop(0.5, `rgba(10, 132, 255, ${ga * 0.35})`);
          gr.addColorStop(1, 'rgba(255, 255, 255, 0)');
        } else {
          gr.addColorStop(0, `rgba(10, 132, 255, ${ga * 0.4})`);
          gr.addColorStop(1, 'rgba(10, 132, 255, 0)');
        }
        ctx.fillStyle = gr;
        ctx.fillRect(0, 0, W, H);
      }
    };

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
      imgL.onload = null;
      imgR.onload = null;
      window.clearTimeout(lenisTimer);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerReset);
      window.removeEventListener('pointerup', handlePointerReset);
      window.removeEventListener('pointerdown', handlePointerDown);
      if (attachedLenis && typeof attachedLenis.off === 'function') {
        attachedLenis.off('scroll', handleScroll);
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
