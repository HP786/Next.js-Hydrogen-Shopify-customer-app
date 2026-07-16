'use client';

import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { WishlistButton } from '@/components/WishlistButton';
import { useCartForm } from '@/lib/cart';
import { formatMoney } from '@/lib/money';
import { categoryLabelFromTags } from '@/lib/shop-taxonomy';
import { useToast } from '@/lib/toast';

export function ProductCard({ product }) {
  const images = product.images?.nodes?.length ? product.images.nodes : product.featuredImage ? [product.featuredImage] : [];
  const [frame, setFrame] = useState(0);
  const timerRef = useRef(null);
  const href = `/products/${product.handle}`;
  const category = categoryLabelFromTags(product.tags);
  const price = product.priceRange.minVariantPrice;
  const compareAt = product.compareAtPriceRange?.minVariantPrice;
  const hasCompare = Boolean(compareAt) && Number(compareAt.amount) > Number(price.amount);
  const variant = product.variants?.nodes?.[0];

  useEffect(() => () => clearInterval(timerRef.current), []);

  function startCycle() {
    if (images.length < 2) return;
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setFrame((f) => (f + 1) % images.length), 900);
  }

  function stopCycle() {
    clearInterval(timerRef.current);
    setFrame(0);
  }

  return (
    <div className="group cursor-pointer" onMouseEnter={startCycle} onMouseLeave={stopCycle}>
      <div className="relative mb-3.5 aspect-[4/5] overflow-hidden bg-surface-container">
        <Link href={href} className="absolute inset-0 block" aria-label={product.title}>
          {images[frame] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={images[frame].url}
              alt={images[frame].altText ?? product.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : null}
        </Link>

        <WishlistButton productId={product.id} className="absolute top-[11px] right-[11px] bg-canvas/90" />

        {images.length > 1 ? (
          <div className="absolute right-0 bottom-[11px] left-0 flex justify-center gap-1.5">
            {images.map((image, i) => (
              <span
                key={image.id ?? i}
                className={`h-[7px] w-[7px] rounded-full transition-colors ${i === frame ? 'bg-primary' : 'bg-canvas/60'}`}
              />
            ))}
          </div>
        ) : null}
      </div>

      {category ? <p className="mb-1 font-sans text-[11.5px] tracking-[0.12em] text-secondary uppercase">{category}</p> : null}
      <Link href={href} className="mb-2.5 block font-serif text-lg leading-tight text-on-surface">
        {product.title}
      </Link>
      <div className="flex items-center justify-between gap-2.5">
        <div className="flex items-baseline gap-2">
          <span className="text-base font-semibold text-on-surface">{formatMoney(price)}</span>
          {hasCompare ? <span className="text-[13px] text-on-surface-variant/60 line-through">{formatMoney(compareAt)}</span> : null}
        </div>
        {variant?.id ? <QuickAddButton variantId={variant.id} available={variant.availableForSale} productTitle={product.title} /> : null}
      </div>
    </div>
  );
}

function QuickAddButton({ variantId, available, productTitle }) {
  const { formProps, register, pending } = useCartForm();
  const showToast = useToast();
  const formId = useId();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!available) {
    return <span className="border border-outline px-3.5 py-1.5 font-sans text-[11.5px] tracking-wide text-on-surface-variant/50 uppercase">Sold out</span>;
  }

  return (
    <>
      {/* Cards render inside the collection page's filter <form>, so this cart-mutation form is
          portaled to <body> — nesting <form> elements is invalid HTML and breaks submission. The
          visible button below is associated to it via the `form` attribute (not a JS
          requestSubmit() call) so the browser sets a real event.submitter, which Hydrogen's cart
          form handler requires — without it the mutation throws and gets silently swallowed. */}
      {mounted
        ? createPortal(
            <form id={formId} {...formProps({ afterSubmit: () => showToast(`${productTitle} added to cart`) })} className="hidden">
              <input type="hidden" {...register('merchandiseId', { value: variantId })} />
              <input type="hidden" {...register('quantity', { value: 1 })} />
            </form>,
            document.body,
          )
        : null}
      <button
        type="submit"
        form={formId}
        disabled={pending}
        className="border border-primary px-3.5 py-1.5 font-sans text-[11.5px] tracking-[0.08em] text-primary uppercase transition hover:bg-primary hover:text-on-primary disabled:opacity-50"
      >
        {pending ? '…' : 'Add'}
      </button>
    </>
  );
}
