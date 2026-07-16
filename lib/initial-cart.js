import 'server-only';
import { cache } from 'react';

import { cartHandlers } from '@/lib/cart-handlers';
import { getStorefrontClient } from '@/lib/storefront';
import { ensureSalesChannelAttribute } from '@/lib/trade-channel';

// Belt-and-suspenders: proxy.js patches the attribute on every cart mutation
// (including the very first "add" that creates the cart), which covers
// client-side navigation where this layout doesn't re-run. This covers full
// page loads / direct navigation to a cart created before that logic existed.
export const getInitialCart = cache(async () => {
  const storefrontClient = await getStorefrontClient();
  const result = await cartHandlers.get({ storefrontClient });
  const cart = result.data.cart;

  if (cart) {
    await ensureSalesChannelAttribute(cart, storefrontClient);
  }

  return cart;
});
