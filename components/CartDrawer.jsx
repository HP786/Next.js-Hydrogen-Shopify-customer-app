'use client';

import { useEffect, useMemo } from 'react';

import { useCart } from '@/lib/cart';
import { CART_DRAWER_ID, closeCartDrawer, configureOpenCartAction, supportsDialogCommands } from '@/lib/cart-drawer';

import { CartNote, CartTotals, CheckoutButton, DiscountCodes, LineItems } from './Cart';

const closeCartCommandAttributes = {
  command: 'close',
  commandfor: CART_DRAWER_ID,
};

export function CartDrawer() {
  const hasItems = useCart((s) => s.data.lines.nodes.length > 0);
  const lines = useCart((s) => s.data.lines.nodes);
  const errors = useCart((s) => s.errors);
  const errorMessages = useMemo(() => {
    const visibleLineIds = new Set(lines.map((line) => line.id));
    const orphanedLineErrors = [...errors.lines.entries()]
      .filter(([lineId]) => !visibleLineIds.has(lineId))
      .flatMap(([, group]) => [...group.userErrors, ...group.warnings]);

    return [
      ...new Set([
        ...errors.network.map((error) => error.message),
        ...errors.cart.userErrors.map((error) => error.message),
        ...errors.cart.warnings.map((warning) => warning.message),
        ...errors.note.userErrors.map((error) => error.message),
        ...orphanedLineErrors.map((error) => error.message),
      ]),
    ];
  }, [errors, lines]);

  useEffect(() => configureOpenCartAction(), []);

  return (
    <dialog id={CART_DRAWER_ID} aria-labelledby="cart-drawer-title" closedby="any" className="bg-canvas text-on-surface">
      <div className="flex h-full flex-col">
        <header className="shrink-0 border-b border-surface-container-high">
          <div className="flex items-center justify-between px-6 py-4">
            <h2 id="cart-drawer-title" className="font-serif text-xl text-on-surface">
              Cart
            </h2>
            <button
              type="button"
              {...closeCartCommandAttributes}
              onClick={() => {
                if (!supportsDialogCommands()) closeCartDrawer();
              }}
              aria-label="Close cart"
              className="hover:opacity-60"
            >
              &times;
            </button>
          </div>
          {errorMessages.length > 0 && (
            <div role="alert" className="bg-error-container px-6 py-3 text-sm text-on-error-container">
              {errorMessages.map((message, i) => (
                <p key={i}>{message}</p>
              ))}
            </div>
          )}
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <LineItems />
        </div>

        {hasItems && (
          <footer className="shrink-0 space-y-3 border-t border-surface-container-high px-6 py-4">
            <DiscountCodes />
            <CartNote />
            <CartTotals />
            <CheckoutButton />
          </footer>
        )}
      </div>
    </dialog>
  );
}
