'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { AnalyticsEvent, configureAnalytics, getAnalytics, getAnalyticsShop } from '@/lib/analytics';
import { useCart } from '@/lib/cart';

/** @param {{shop: import('@shopify/hydrogen').ShopAnalytics}} props */
export function AnalyticsTracker({ shop }) {
  configureAnalytics(shop);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams?.toString() ?? '';
  const key = `${pathname}?${search}`;
  const cart = useCart((s) => s.data);

  useEffect(() => {
    const bus = getAnalytics();
    if (!bus) return;
    bus.publish(AnalyticsEvent.PAGE_VIEWED, {
      url: window.location.href,
      shop: getAnalyticsShop(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fire once per route change
  }, [key]);

  useEffect(() => {
    const bus = getAnalytics();
    // Diffs cart lines against the previous snapshot and publishes CART_UPDATED /
    // PRODUCT_ADD_TO_CART / PRODUCT_REMOVED_FROM_CART as needed — this is the only
    // way those events fire; nothing does it automatically.
    bus?.updateCart(cart);
  }, [cart]);

  return null;
}
