'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { useCart } from '@/lib/cart';
import { CART_DRAWER_ID, openCartDrawer, supportsDialogCommands } from '@/lib/cart-drawer';

const openCartCommandAttributes = {
  command: 'show-modal',
  commandfor: CART_DRAWER_ID,
};

export function CartButton() {
  const totalQuantity = useCart((s) => s.data.totalQuantity);
  const [hasHydrated, setHasHydrated] = useState(false);
  const cartLabel =
    totalQuantity === 0
      ? 'Cart, empty'
      : `Cart, ${totalQuantity > 99 ? '99 or more' : totalQuantity} ${totalQuantity === 1 ? 'item' : 'items'}`;

  useEffect(() => setHasHydrated(true), []);

  const badge = hasHydrated && totalQuantity > 0 ? (totalQuantity > 99 ? '99+' : totalQuantity) : null;

  if (!hasHydrated) {
    return (
      <Link href="/cart" aria-label={cartLabel} className="relative transition-opacity hover:opacity-70">
        <BagIcon className="h-5 w-5" />
      </Link>
    );
  }

  return (
    <button
      type="button"
      aria-label={cartLabel}
      aria-controls={CART_DRAWER_ID}
      aria-haspopup="dialog"
      {...openCartCommandAttributes}
      onClick={() => {
        if (!supportsDialogCommands()) openCartDrawer();
      }}
      className="relative transition-opacity hover:opacity-70"
    >
      <BagIcon className="h-5 w-5" />
      {badge ? (
        <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-on-primary">
          {badge}
        </span>
      ) : null}
    </button>
  );
}

function BagIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" {...props}>
      <path d="M6 8h12l1 13H5L6 8Z" strokeLinejoin="round" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" strokeLinecap="round" />
    </svg>
  );
}
