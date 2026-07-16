'use client';

import { useEffect, useState } from 'react';

export function HeroCarousel({ images }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % images.length), 6000);
    return () => clearInterval(id);
  }, [images.length]);

  const active = images[index];
  if (!active) return null;

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={index}
        src={active.url}
        alt={active.altText ?? ''}
        className="absolute inset-0 h-full w-full animate-[hh-ken_9s_ease-in-out_infinite_alternate] object-cover"
      />
      {images.length > 1 ? (
        <div className="absolute bottom-[26px] left-[26px] flex gap-2">
          {images.map((image, i) => (
            <button
              key={image.url ?? i}
              type="button"
              aria-label={`Show hero image ${i + 1}`}
              onClick={() => setIndex(i)}
              className="h-[9px] w-[9px] rounded-full border border-white p-0 transition-all"
              style={{ background: i === index ? '#fff' : 'transparent' }}
            />
          ))}
        </div>
      ) : null}
    </>
  );
}
