'use client';

import { AnalyticsEvent, createStorefrontAnalytics } from '@shopify/hydrogen';

export { AnalyticsEvent };

let bus = null;
let analyticsShop = null;

/** @param {import('@shopify/hydrogen').ShopAnalytics} shop */
export function configureAnalytics(shop) {
  analyticsShop = shop;
}

export function getAnalyticsShop() {
  return analyticsShop;
}

export function getAnalytics() {
  if (typeof window === 'undefined') return null;
  if (!analyticsShop) return null;
  bus ??= createStorefrontAnalytics({
    shop: analyticsShop,
    // No consent-banner UI exists in this app, so 'default-banner' mode was silently
    // waiting forever for a banner interaction that could never happen — meaning no
    // analytics ever reached Shopify. 'no-banner' tracks immediately instead.
    consent: { mode: 'no-banner' },
  });
  return bus;
}
