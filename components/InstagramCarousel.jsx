'use client';

import { useRef, useState } from 'react';

import { LOGO_URL } from '@/lib/brand';

const INSTAGRAM_URL = 'https://instagram.com/hausandharbour';

export function InstagramCarousel({ slides }) {
  const scrollerRef = useRef(null);
  const [active, setActive] = useState(0);

  function scrollToCard(index) {
    const el = scrollerRef.current;
    const card = el?.children[index];
    if (!card) return;
    el.scrollTo({ left: card.offsetLeft - el.offsetLeft, behavior: 'smooth' });
  }

  function handleScroll() {
    const el = scrollerRef.current;
    if (!el) return;
    let closest = 0;
    let closestDistance = Infinity;
    Array.from(el.children).forEach((card, i) => {
      const distance = Math.abs(card.offsetLeft - el.offsetLeft - el.scrollLeft);
      if (distance < closestDistance) {
        closestDistance = distance;
        closest = i;
      }
    });
    setActive(closest);
  }

  function handleNext() {
    scrollToCard(Math.min(active + 1, slides.length - 1));
  }

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        className="hide-scrollbar flex snap-x snap-mandatory gap-3.5 overflow-x-auto scroll-smooth px-5 md:px-16"
      >
        {slides.map((slide) => (
          <SlideCard key={slide.alt} slide={slide} />
        ))}
      </div>

      <button
        type="button"
        onClick={handleNext}
        aria-label="Next post"
        disabled={active >= slides.length - 1}
        className="absolute top-1/2 right-6 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-on-primary shadow-lg transition hover:bg-charcoal-muted disabled:opacity-0 md:flex"
      >
        <ArrowIcon className="h-5 w-5" />
      </button>

      <div className="mt-5 flex justify-center gap-2">
        {slides.map((slide, i) => (
          <button
            key={slide.alt}
            type="button"
            aria-label={`Go to post ${i + 1}`}
            onClick={() => scrollToCard(i)}
            className={`h-1.5 w-1.5 rounded-full transition-colors ${i === active ? 'bg-secondary' : 'bg-secondary/30 hover:bg-secondary/60'}`}
          />
        ))}
      </div>
    </div>
  );
}

function SlideCard({ slide }) {
  if (slide.isHandle) {
    return (
      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative aspect-[3/4] w-[240px] shrink-0 snap-start overflow-hidden bg-surface-container-high sm:w-[280px]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={slide.src} alt={slide.alt} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/55 transition-colors group-hover:bg-black/65" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white">
          <InstagramGlyph className="h-8 w-8" />
          <span className="font-sans text-sm font-semibold tracking-wide">@hausandharbour</span>
        </div>
      </a>
    );
  }

  return (
    <a
      href={INSTAGRAM_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative aspect-[3/4] w-[240px] shrink-0 snap-start overflow-hidden bg-surface-container-high sm:w-[280px]"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={slide.src} alt={slide.alt} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/30" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={LOGO_URL} alt="" aria-hidden="true" className="absolute top-3 right-3 h-7 w-auto opacity-90 brightness-0 invert" />
      <p className="absolute right-4 bottom-9 left-4 font-sans text-lg leading-snug font-bold text-white uppercase">{slide.caption}</p>
      <span className="absolute bottom-3 left-4 font-sans text-[11px] tracking-wide text-white/85">hausandharbour.com</span>
    </a>
  );
}

function InstagramGlyph(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ArrowIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
