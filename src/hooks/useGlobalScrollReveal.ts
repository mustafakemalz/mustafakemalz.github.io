import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useGlobalScrollReveal = () => {
  const { pathname } = useLocation();

  useEffect(() => {
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
        rootMargin: '0px 0px -10% 0px',
      }
    );

    // Observe existing elements
    const observeAll = () => {
      const elements = document.querySelectorAll(
        '.reveal:not(.active), .reveal-stagger:not(.active), .reveal-journey:not(.active)'
      );
      elements.forEach((el) => observer.observe(el));
    };

    // Initial observe after React finishes painting
    const rafId = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        observeAll();
      });
    });

    // Watch for new elements added to the DOM (React lazy rendering)
    const mutationObserver = new MutationObserver(() => {
      observeAll();
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
