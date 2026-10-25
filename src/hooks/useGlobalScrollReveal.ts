import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SELECTOR =
  '.reveal:not(.active), .reveal-stagger:not(.active), .reveal-journey:not(.active)';

export const useGlobalScrollReveal = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      document.querySelectorAll(SELECTOR).forEach((el) => el.classList.add('active'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px -8% 0px',
      }
    );

    const observeSubtree = (root: ParentNode) => {
      if (root instanceof Element && root.matches(SELECTOR)) {
        observer.observe(root);
      }
      root.querySelectorAll(SELECTOR).forEach((el) => observer.observe(el));
    };

    const rafId = requestAnimationFrame(() => {
      observeSubtree(document);
    });

    // Only inspect newly added Element nodes instead of re-querying document.body on every text update
    const mutationObserver = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (let i = 0; i < m.addedNodes.length; i++) {
          const node = m.addedNodes[i];
          if (node.nodeType === Node.ELEMENT_NODE) {
            observeSubtree(node as Element);
          }
        }
      }
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [pathname]);
};
