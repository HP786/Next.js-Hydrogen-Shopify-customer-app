'use client';

import { useCart } from '@/lib/cart';

const CERTIFIED_TAG = 'business_certified';

/**
 * Explains why the trade discount isn't applying yet (or confirms it will).
 * The threshold comes from the customer's own min_order_quantity metafield —
 * deliberately never their discount_percent, which isn't exposed to the
 * storefront (see lib/customer-account/queries.js).
 */
export function TradeDiscountProgress({ minOrderQuantity }) {
  const lines = useCart((s) => s.data.lines.nodes);

  if (!minOrderQuantity) return null;

  const certifiedQuantity = lines.reduce((total, line) => {
    const tags = line.merchandise?.product?.tags ?? [];
    return tags.includes(CERTIFIED_TAG) ? total + line.quantity : total;
  }, 0);

  if (certifiedQuantity >= minOrderQuantity) {
    return (
      <p role="status" className="border border-green-600/30 bg-green-50 px-3 py-2 font-sans text-sm text-green-800">
        Your trade discount will apply to eligible items at checkout.
      </p>
    );
  }

  const remaining = minOrderQuantity - certifiedQuantity;

  return (
    <p role="status" className="border border-amber-600/30 bg-amber-50 px-3 py-2 font-sans text-sm text-amber-800">
      Add {remaining} more trade-certified {remaining === 1 ? 'item' : 'items'} to unlock your trade discount
      {certifiedQuantity > 0 ? ` (${certifiedQuantity} of ${minOrderQuantity} so far)` : ''}.
    </p>
  );
}
