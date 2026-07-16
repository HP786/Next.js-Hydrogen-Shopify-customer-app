'use client';

import { useWishlist } from '@/lib/wishlist';

export function WishlistButton({ productId, size = 34, className = '' }) {
  const { has, toggle } = useWishlist();
  const wished = has(productId);

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggle(productId);
      }}
      title="Save"
      aria-label={wished ? 'Remove from wishlist' : 'Save to wishlist'}
      aria-pressed={wished}
      style={{ width: size, height: size }}
      className={`flex items-center justify-center rounded-full bg-canvas/90 transition hover:bg-white ${className}`}
    >
      <HeartIcon filled={wished} />
    </button>
  );
}

function HeartIcon({ filled }) {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill={filled ? '#8a4b3a' : 'none'}
      stroke={filled ? '#8a4b3a' : '#211e18'}
      strokeWidth="1.5"
      className={filled ? 'animate-[hh-pop_0.4s_ease]' : ''}
    >
      <path d="M12 20s-7-4.6-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.4-7 10-7 10z" />
    </svg>
  );
}
