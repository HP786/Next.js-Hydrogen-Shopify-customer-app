'use client';

import { CartProvider } from '@/lib/cart';
import { ToastProvider } from '@/lib/toast';
import { WishlistProvider } from '@/lib/wishlist';

/**
 * @param {{cart?: unknown, children: React.ReactNode}} props
 */
export function Providers({ cart, children }) {
  return (
    <CartProvider initialData={cart}>
      <WishlistProvider>
        <ToastProvider>{children}</ToastProvider>
      </WishlistProvider>
    </CartProvider>
  );
}
