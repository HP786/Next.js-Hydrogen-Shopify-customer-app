'use client';

import { useEffect, useRef } from 'react';

// Sticks the announcement bar + nav together, then hides just the announcement
// bar (not the nav) once the page scrolls past it while still scrolling down,
// and brings it back on any scroll-up. The nav child must carry data-sticky-nav
// so we can measure its height and only translate the announcement bar away.
export function ScrollHideChrome({ children }) {
  const wrapperRef = useRef(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const nav = wrapper.querySelector('[data-sticky-nav]');

    let lastY = 0;
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      const hideDistance = Math.max(0, wrapper.offsetHeight - (nav?.offsetHeight ?? 0));

      if (y > hideDistance && y > lastY) {
        wrapper.style.transform = `translateY(-${hideDistance}px)`;
      } else if (y < lastY - 2 || y <= hideDistance) {
        wrapper.style.transform = 'translateY(0)';
      }
      lastY = y;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div ref={wrapperRef} className="sticky top-0 z-40 transition-transform duration-[400ms] ease-[cubic-bezier(.4,0,.2,1)]">
      {children}
    </div>
  );
}
