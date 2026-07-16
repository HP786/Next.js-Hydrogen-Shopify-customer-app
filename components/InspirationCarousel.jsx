'use client';

import { useEffect, useState } from 'react';

export function InspirationCarousel({ images }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((current) => (current + 1) % images.length), 5000);
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <div className="relative w-full overflow-hidden">
      <div
        className="flex transition-transform duration-1000 ease-in-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {images.map((image) => (
          <div key={image.alt} className="aspect-[16/9] w-full shrink-0 md:aspect-[21/9]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image.src} alt={image.alt} className="h-full w-full object-cover" />
          </div>
        ))}
      </div>
      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-3">
        {images.map((image, i) => (
          <button
            key={image.alt}
            type="button"
            aria-label={`Show slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-2 w-2 rounded-full transition-colors ${i === index ? 'bg-secondary' : 'bg-secondary/40 hover:bg-secondary/70'}`}
          />
        ))}
      </div>
    </div>
  );
}
