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

    // Pre-rendered static dot grid layer (eliminates ~12,000 fillRect calls per frame)
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
    let lastRenderTime = 0;
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

    // Pre-allocated bucket arrays (7 luminance levels) to batch fillStyle state changes
    const bucketsX: number[][] = Array.from({ length: 7 }, () => []);
    const bucketsY: number[][] = Array.from({ length: 7 }, () => []);
    const bucketsChar: string[][] = Array.from({ length: 7 }, () => []);

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
      forceNextRender = true;
    };

    rebuildDotsRef.current = buildDotLayer;

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

    const checkReady = () => {
      if (!isMounted || !leftLoaded || !rightLoaded) return;
      startLoop();
    };

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = container.parentElement?.offsetHeight || window.innerHeight;
      tp = cl(scrollY / (heroHeight * 0.75), 0, 1);
      forceNextRender = true;
    };

    let textMask = new Float32Array(0);
    let hasTextMask = false;

    const updateTextMask = () => {
      if (cols <= 0 || rows <= 0 || W <= 0 || H <= 0) {
        hasTextMask = false;
        return;
      }
      const infoEl = container.parentElement?.querySelector('.header-info');
      if (!infoEl) {
        hasTextMask = false;
        return;
      }
      const cRect = container.getBoundingClientRect();
      const children = Array.from(infoEl.children) as HTMLElement[];
      const targets = children.length > 0 ? children : [infoEl as HTMLElement];

      const rects = targets
        .map((el) => {
          const r = el.getBoundingClientRect();
          return {
            x0: r.left - cRect.left - 14,
            y0: r.top - cRect.top - 8,
            x1: r.right - cRect.left + 18,
            y1: r.bottom - cRect.top + 8,
          };
        })
        .filter((r) => r.x1 > r.x0 && r.y1 > r.y0);

      if (rects.length === 0) {
        hasTextMask = false;
        return;
      }

      const total = cols * rows;
      if (textMask.length !== total) {
        textMask = new Float32Array(total);
      }

      const feather = 36;
      const minMask = 0.36;

      for (let y = 0; y < rows; y++) {
        const Y = y * ch + ch / 2;
        const rowOffset = y * cols;
        for (let x = 0; x < cols; x++) {
          const X = x * cw + cw / 2;
          let minDist = feather;
          for (let i = 0; i < rects.length; i++) {
            const box = rects[i];
            const dx = Math.max(box.x0 - X, 0, X - box.x1);
            const dy = Math.max(box.y0 - Y, 0, Y - box.y1);
            if (dx === 0 && dy === 0) {
              minDist = 0;
              break;
            }
            if (dx < minDist && dy < minDist) {
              const d = Math.hypot(dx, dy);
              if (d < minDist) minDist = d;
            }
          }
          textMask[rowOffset + x] =
            minDist >= feather ? 1.0 : lerp(minMask, 1.0, ease(minDist / feather));
        }
      }
      hasTextMask = true;
      forceNextRender = true;
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
      updateTextMask();
      buildDotLayer();
      handleScroll();
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });

    let prevW = W;
    let prevH = H;
    const resizeObserver = new ResizeObserver(() => {
      const curW = container.clientWidth || window.innerWidth;
      const curH = container.clientHeight || window.innerHeight;
      if (curW !== prevW || curH !== prevH) {
        prevW = curW;
        prevH = curH;
        handleResize();
      } else {
        updateTextMask();
      }
    });
    resizeObserver.observe(container);
    const infoEl = container.parentElement?.querySelector('.header-info');
    if (infoEl) {
      resizeObserver.observe(infoEl);
    }

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (isMounted) {
          updateTextMask();
        }
      });
    }

    handleScroll();
    p = tp;
    window.addEventListener('scroll', handleScroll, { passive: true });

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

    const handlePointerDown = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      if (
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom &&
        e.clientX >= rect.left &&
        e.clientX <= rect.right
      ) {
        touchImpulse = 1.0;
        forceNextRender = true;
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

      // Adaptive frame rate: 60fps during active scroll/pointer/touch, ~15fps during calm idle breathing
      const isActivelyInteracting =
        forceNextRender ||
        Math.abs(tp - p) > 0.002 ||
        Math.abs(targetMx - mx) > 0.002 ||
        Math.abs(targetMy - my) > 0.002 ||
        touchImpulse > 0.01 ||
        (p > 0.55 && p < 0.92);

      const minInterval = isActivelyInteracting ? 15 : 64;
      if (now - lastRenderTime < minInterval) return;
      lastRenderTime = now;
      forceNextRender = false;

      const t = (now - t0) / 1000;
      p += (tp - p) * 0.12;
      mx += (targetMx - mx) * 0.12;
      my += (targetMy - my) * 0.12;

      if (touchImpulse > 0) {
        touchImpulse = Math.max(0, touchImpulse - 0.035);
      }

      const isDark = themeRef.current !== 'light';

      const app = lerp(0.36, 1, ease(cl(p / 0.62)));
      const dis = ease(cl((p - 0.84) / 0.16)) * 0.9;

      const scaleFactor = W < 600 ? 1.2 : 1.38;
      const kpx = Math.min((W / HANDS_META.W) * scaleFactor, (H * 0.64) / HANDS_META.H);
      const sx = kpx / cw;
      const sy = kpx / ch;

      const g = lerp(cols * 0.18, 0, app) + dis * cols * 0.08;
      const fl = prefersReducedMotion ? 0 : Math.sin(t * 0.85) * 0.65;
      const fr = prefersReducedMotion ? 0 : Math.sin(t * 0.85 + 2) * 0.65;
      const par = mx * 3.0;

      // Balanced placement: keep both left and right hands clearly visible in the viewport at scrollY = 0
      const centerXRatio = W >= 1024 ? 0.56 : 0.5;
      const centerYRatio = W >= 768 ? 0.42 : 0.36;
      const ox = cols * centerXRatio - (HANDS_META.W / 2) * sx;
      const oy = rows * centerYRatio - (HANDS_META.H / 2) * sy + my * 2;

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

      const t6 = Math.floor(t * 6);
      const t8 = Math.floor(t * 8);

      for (let y = 0; y < rows; y++) {
        const Y = y * ch + ch / 2;
        const rowOffset = y * cols;
        for (let x = 0; x < cols; x++) {
          const cellIdx = rowOffset + x;
          const raw = imgData[cellIdx << 2];
          // Fast skip for empty background cells when not dispersing
          if (raw < 17 && dis === 0) continue;

          const X = x * cw + cw / 2;
          const rawL = raw >= 17 ? Math.pow(raw / 255, 0.92) : 0;
          let l = rawL;

          // Smoothly attenuate ASCII luminance directly behind left-aligned hero typography without erasing characters
          if (l > 0.06 && hasTextMask) {
            l = Math.max(0.065, l * textMask[cellIdx]);
          }

          const on = l > 0.06 && (dis === 0 || hash(x, y, 5) >= dis);

          if (on) {
            const bucketIdx = Math.min(6, Math.floor(l * 7));
            const arr = LV[bucketIdx];
            const b = hash(x, y, 9) < 0.1 ? t6 : 0;
            bucketsX[bucketIdx].push(X);
            bucketsY[bucketIdx].push(Y);
            bucketsChar[bucketIdx].push(arr[Math.floor(hash(x, y, b) * arr.length)]);
          } else if (dis > 0) {
            const c = hash(x, 0, 3);
            const h = (t * (6 + c * 14) + c * rows * 3) % (rows * 1.8);
            const d = y - h;
            if (d < 0 && d > -12) {
              const rain = (1 + d / 12) * dis * 0.65;
              ctx.fillStyle = isDark
                ? `rgba(216, 216, 220, ${rain * 0.65})`
                : `rgba(44, 44, 48, ${rain * 0.45})`;
              ctx.fillText(hash(x, y, t8) < 0.5 ? '0' : '1', X, Y);
            }
          }
        }
      }

      // Render active ASCII hand cells batched into 7 monochrome luminance buckets
      for (let b = 0; b < 7; b++) {
        const xs = bucketsX[b];
        const count = xs.length;
        if (count === 0) continue;
        const ys = bucketsY[b];
        const chars = bucketsChar[b];
        const midL = (b + 0.5) / 7;
        if (isDark) {
          const v = Math.round(52 + midL * 168);
          ctx.fillStyle = `rgb(${v}, ${v}, ${Math.min(255, v + 4)})`;
        } else {
          const lightV = Math.round(188 - midL * 142);
          ctx.fillStyle = `rgb(${lightV}, ${lightV}, ${lightV + 4})`;
        }
        for (let i = 0; i < count; i++) {
          ctx.fillText(chars[i], xs[i], ys[i]);
        }
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
      rebuildDotsRef.current = null;
      imgL.onload = null;
      imgR.onload = null;
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerReset);
      window.removeEventListener('pointerup', handlePointerReset);
      window.removeEventListener('pointerdown', handlePointerDown);
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
