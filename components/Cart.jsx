'use client';

import { ShopPayButton } from '@shopify/hydrogen/react';
import { useEffect, useMemo, useState } from 'react';

import { useCart, useCartForm } from '@/lib/cart';
import { formatMoney } from '@/lib/money';

/** Groups bundle ("componentized") child lines under their parent line id. */
function buildChildrenMap(lines) {
  const children = {};
  for (const line of lines) {
    const parentId = line.parentRelationship?.parent?.id;
    if (parentId) {
      (children[parentId] ??= []).push(line);
    }
    if (line.lineComponents) {
      for (const child of line.lineComponents) {
        (children[line.id] ??= []).push(child);
      }
    }
  }
  return children;
}

export function CartContent() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-serif text-4xl text-on-surface">Cart</h1>
      <CartErrorBanner />
      <LineItems />
      <CartFooter />
    </main>
  );
}

function CartErrorBanner() {
  const errors = useCart((s) => s.errors);
  const lines = useCart((s) => s.data.lines.nodes);
  const [dismissedAt, setDismissedAt] = useState(0);
  const visibleLineIds = useMemo(() => new Set(lines.map((line) => line.id)), [lines]);

  if (errors.lastUpdatedAt <= dismissedAt) return null;

  const orphanedLineErrors = [...errors.lines.entries()]
    .filter(([lineId]) => !visibleLineIds.has(lineId))
    .flatMap(([, group]) => [...group.userErrors, ...group.warnings]);

  const bannerMessages = [
    ...new Set([
      ...errors.network.map((error) => error.message),
      ...errors.cart.userErrors.map((error) => error.message),
      ...errors.cart.warnings.map((warning) => warning.message),
      ...errors.note.userErrors.map((error) => error.message),
      ...orphanedLineErrors.map((error) => error.message),
    ]),
  ];

  if (bannerMessages.length === 0) return null;

  return (
    <div role="alert" className="mt-6 border border-error/40 bg-error-container p-4 font-sans text-sm text-on-error-container">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          {bannerMessages.map((message, index) => (
            <p key={index}>{message}</p>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setDismissedAt(Date.now())}
          className="shrink-0 font-sans text-xs font-semibold tracking-wide text-red-700 uppercase hover:text-red-950"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}

export function CartFooter() {
  return (
    <div className="mt-8 space-y-6">
      <DiscountCodes />
      <AppliedGiftCards />
      <CartNote />
      <CartTotals />
      <CheckoutButton />
    </div>
  );
}

export function CartTotals() {
  const totalQuantity = useCart((s) => s.data.totalQuantity);
  const cost = useCart((s) => s.data.cost);
  const isTotalsPending = useCart((s) => s.pending.lines.size > 0 || s.pending.discountCodes.size > 0);

  return (
    <div className={`space-y-2 font-sans transition-opacity ${isTotalsPending ? 'opacity-30' : ''}`}>
      <div className="flex justify-between text-sm text-on-surface-variant">
        <span>Subtotal ({totalQuantity} items)</span>
        <span>{formatMoney(cost.subtotalAmount)}</span>
      </div>
      <div className="flex justify-between font-serif text-lg text-on-surface">
        <span>Total</span>
        <span>{formatMoney(cost.totalAmount)}</span>
      </div>
    </div>
  );
}

export function CheckoutButton() {
  const lines = useCart((s) => s.data.lines.nodes);
  const checkoutUrl = useCart((s) => s.data.checkoutUrl);

  return checkoutUrl && lines.length > 0 ? (
    <div className="space-y-3">
      <ShopPayButton channel="hydrogen" width="100%" height="56px" borderRadius="2" />
      <a
        href={checkoutUrl}
        className="block bg-primary py-4 text-center font-sans text-sm font-semibold tracking-widest text-on-primary uppercase hover:bg-charcoal-muted"
      >
        Continue to Checkout &rarr;
      </a>
    </div>
  ) : (
    <span
      role="link"
      aria-disabled="true"
      className="block cursor-not-allowed bg-primary/40 py-4 text-center font-sans text-sm font-semibold tracking-widest text-on-primary uppercase"
    >
      Check out
    </span>
  );
}

export function LineItems() {
  const lines = useCart((s) => s.data.lines.nodes);
  const loading = useCart((s) => s.loading);
  const childrenMap = useMemo(() => buildChildrenMap(lines), [lines]);

  if (loading) {
    return (
      <div className="mt-8 animate-pulse space-y-6">
        {[1, 2].map((i) => (
          <div key={i} className="flex items-center gap-6">
            <div className="h-24 w-24 bg-surface-container" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 bg-surface-container" />
              <div className="h-3 w-20 bg-surface-container" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const topLevelLines = lines.filter((line) => !line.parentRelationship?.parent);

  if (topLevelLines.length === 0) {
    return <p className="mt-8 font-sans text-on-surface-variant">Your cart is empty.</p>;
  }

  return (
    <ul className="mt-8 divide-y divide-surface-container-high">
      {topLevelLines.map((line) => (
        <CartLineItem key={line.id} line={line} childrenMap={childrenMap} />
      ))}
    </ul>
  );
}

function CartLineItem({ line, childrenMap }) {
  const lineErrors = useCart((s) => s.errors.lines);
  const pendingLines = useCart((s) => s.pending.lines);
  const { formProps, register } = useCartForm();
  const children = childrenMap[line.id];

  const errorsForLine = lineErrors.get(line.id);
  const firstLineError = errorsForLine?.userErrors[0] ?? errorsForLine?.warnings[0];
  const errorId = `cart-line-error-${line.id.replace(/[^a-zA-Z0-9_-]/g, '-')}`;

  return (
    <li className="py-6">
      <form {...formProps()} aria-describedby={firstLineError ? errorId : undefined} className="space-y-3">
        <button {...register('set')} />
        <div className="flex items-center gap-6">
          <input type="hidden" {...register('lineId', { value: line.id })} />

          {line.merchandise?.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={line.merchandise.image.url}
              alt={line.merchandise.image.altText ?? line.merchandise.product.title}
              className="h-24 w-24 bg-surface-container-low object-cover"
            />
          )}

          <div className="flex-1 font-sans">
            <p className="font-semibold text-on-surface">{line.merchandise?.product.title ?? 'Unknown product'}</p>
            {line.merchandise?.title && line.merchandise.title !== 'Default Title' && (
              <p className="text-xs text-on-surface-variant">{line.merchandise.title}</p>
            )}
            <p className="text-sm text-on-surface-variant">
              {formatMoney(line.cost.amountPerQuantity)} each
              {line.cost.compareAtAmountPerQuantity &&
                Number(line.cost.compareAtAmountPerQuantity.amount) > Number(line.cost.amountPerQuantity.amount) && (
                  <span className="ml-2 text-on-surface-variant/50 line-through">{formatMoney(line.cost.compareAtAmountPerQuantity)}</span>
                )}
            </p>
            <p className="text-sm font-medium text-on-surface">{formatMoney(line.cost.totalAmount)}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              {...register('decrease')}
              disabled={line.quantity <= 1}
              className="h-8 w-8 border border-outline-variant text-sm hover:border-primary disabled:cursor-not-allowed disabled:opacity-30"
            >
              -
            </button>

            <input
              {...register('quantity', { value: line.quantity, interactive: true })}
              aria-invalid={Boolean(firstLineError)}
              className={`w-8 text-center text-sm tabular-nums transition-opacity ${pendingLines.has(line.id) ? 'opacity-30' : ''}`}
            />

            <button
              type="submit"
              {...register('increase')}
              className="h-8 w-8 border border-outline-variant text-sm hover:border-primary disabled:cursor-not-allowed disabled:opacity-30"
            >
              +
            </button>
          </div>

          <button type="submit" {...register('remove')} className="font-sans text-sm text-red-600 underline hover:text-red-800">
            Remove
          </button>
        </div>

        {firstLineError && (
          <p id={errorId} role="alert" className="font-sans text-sm text-red-600">
            {firstLineError.message}
          </p>
        )}
      </form>

      {children && children.length > 0 && (
        <div className="mt-3 ml-12">
          <p className="sr-only">Line items with {line.merchandise?.product.title}</p>
          <ul className="space-y-3 border-l border-surface-container-high pl-6">
            {children.map((child) => (
              <CartLineItem key={child.id} line={child} childrenMap={childrenMap} />
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}

export function DiscountCodes() {
  const lines = useCart((s) => s.data.lines.nodes);
  const discountCodes = useCart((s) => s.data.discountCodes);
  const pendingDiscountCodes = useCart((s) => s.pending.discountCodes);
  const discountCodeErrors = useCart((s) => s.errors.discountCodes);
  const { formProps, register } = useCartForm();

  if (lines.length === 0) return null;

  return (
    <div className="font-sans">
      <h2 className="text-xs font-semibold tracking-widest text-on-surface-variant uppercase">Discount Codes</h2>

      {discountCodes.length > 0 && (
        <ul className="mt-3 space-y-2">
          {discountCodes.map((dc) => {
            const isPending = pendingDiscountCodes.has(dc.code);
            const errorsForDiscountCode = discountCodeErrors.get(dc.code);
            const firstDiscountCodeError = errorsForDiscountCode?.userErrors[0] ?? errorsForDiscountCode?.warnings[0];
            return (
              <li key={dc.code} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm">
                  <code className={`bg-surface-container px-2 py-0.5 font-mono text-xs transition-opacity ${isPending ? 'opacity-30' : ''}`}>
                    {dc.code}
                  </code>
                  <span className={`transition-opacity ${isPending ? 'opacity-30' : ''} ${dc.applicable ? 'text-green-600' : 'text-amber-600'}`}>
                    {dc.applicable ? 'Applied' : 'Not applicable'}
                  </span>
                  {firstDiscountCodeError && (
                    <p role="alert" className="text-xs text-red-600">
                      {firstDiscountCodeError.message}
                    </p>
                  )}
                </span>
                <form {...formProps()}>
                  <input type="hidden" {...register('discountCode', { value: dc.code })} />
                  <button type="submit" {...register('discount-remove')} className="text-xs text-red-600 underline hover:text-red-800">
                    Remove
                  </button>
                </form>
              </li>
            );
          })}
        </ul>
      )}

      <form
        {...formProps({
          beforeSubmit: (e) => {
            const code = new FormData(e.currentTarget).get('discountCode');
            if (!code?.trim()) {
              e.preventDefault();
              return;
            }
            const isDuplicate = discountCodes.some((dc) => dc.code.toLowerCase() === code.toLowerCase());
            if (isDuplicate) e.preventDefault();
          },
          afterSubmit: (e) => e.currentTarget.reset(),
        })}
        className="mt-3 flex gap-2"
      >
        <input
          type="text"
          {...register('discountCode', { defaultValue: '' })}
          placeholder="Enter discount code"
          className="flex-1 border border-outline-variant px-3 py-1.5 text-sm focus:border-primary focus:outline-none"
        />
        <button type="submit" {...register('discount-apply')} className="bg-primary px-4 py-1.5 text-sm font-medium text-on-primary hover:bg-charcoal-muted">
          Apply
        </button>
      </form>
    </div>
  );
}

/**
 * Read-only display of gift cards already applied to the cart (e.g. via checkout).
 * Adding/removing gift cards from the cart isn't supported by the Hydrogen preview's
 * cart primitive yet (no register() action for it) — see project notes.
 */
function AppliedGiftCards() {
  const giftCards = useCart((s) => s.data.appliedGiftCards);
  if (!giftCards || giftCards.length === 0) return null;

  return (
    <div className="font-sans">
      <h2 className="text-xs font-semibold tracking-widest text-on-surface-variant uppercase">Gift Cards</h2>
      <ul className="mt-3 space-y-1 text-sm">
        {giftCards.map((card) => (
          <li key={card.id} className="flex justify-between">
            <span>&bull;&bull;&bull;&bull; {card.lastCharacters}</span>
            <span>{formatMoney(card.amountUsed)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CartNote() {
  const lines = useCart((s) => s.data.lines.nodes);
  const note = useCart((s) => s.data.note ?? '');
  const pending = useCart((s) => s.pending.note);
  const { formProps, register } = useCartForm();
  const [draft, setDraft] = useState(note);

  useEffect(() => {
    if (!pending) setDraft(note);
  }, [note, pending]);

  if (lines.length === 0) return null;

  return (
    <div className="font-sans">
      <div className="flex items-center gap-2">
        <h2 className="text-xs font-semibold tracking-widest text-on-surface-variant uppercase">Order Note</h2>
        {pending && <span className="text-xs text-on-surface-variant/60">Saving...</span>}
      </div>
      <form {...formProps()} className="mt-3 space-y-2">
        <input type="hidden" {...register('note', { value: draft })} />
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Add a note to your order..."
          rows={2}
          className="w-full border border-outline-variant px-3 py-2 text-sm focus:border-primary focus:outline-none"
        />
        <button
          type="submit"
          {...register('note-update')}
          disabled={draft === note}
          className="bg-primary px-4 py-1.5 text-sm font-medium text-on-primary hover:bg-charcoal-muted disabled:opacity-40"
        >
          Save note
        </button>
      </form>
    </div>
  );
}
