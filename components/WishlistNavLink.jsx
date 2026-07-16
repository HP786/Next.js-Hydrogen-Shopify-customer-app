'use client';

import Link from 'next/link';

import { useWishlist } from '@/lib/wishlist';

export function WishlistNavLink() {
  const { count } = useWishlist();

  return (
    <Link href="/wishlist" aria-label="Wishlist" className="relative flex transition-opacity hover:opacity-70">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 20s-7-4.6-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.4-7 10-7 10z" />
      </svg>
      {count > 0 ? (
        <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-secondary px-0.5 text-[10px] font-semibold text-on-secondary">
          {count}
        </span>
      ) : null}
    </Link>
  );
}
