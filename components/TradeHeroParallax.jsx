'use client';

import { useEffect, useRef } from 'react';

// Slow vertical drift on the trade-landing hero image as the page scrolls,
// oversized 130% tall so the drift never reveals empty space beneath it.
export function TradeHeroParallax({ src, alt }) {
  const imgRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      if (imgRef.current) imgRef.current.style.transform = `translate3d(0, ${-y * 0.28}px, 0)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img ref={imgRef} src={src} alt={alt} className="absolute top-0 left-0 h-[130%] w-full object-cover will-change-transform" />
  );
}
