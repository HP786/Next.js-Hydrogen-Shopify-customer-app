'use client';

import { canAddToCart } from '@shopify/hydrogen';
import { createProductComponents, ShopPayButton } from '@shopify/hydrogen/react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { ProductCard } from '@/components/ProductCard';
import { WishlistButton } from '@/components/WishlistButton';
import { AnalyticsEvent, getAnalytics, getAnalyticsShop } from '@/lib/analytics';
import { openCartDrawer } from '@/lib/cart-drawer';
import { formatMoney } from '@/lib/money';
import { categoryLabelFromTags } from '@/lib/shop-taxonomy';
import { STOCK_IMAGES } from '@/lib/stock-images';
import { useToast } from '@/lib/toast';

const { ProductProvider, useProductForm } = createProductComponents();

const SPECS = [
  { title: 'Machine Washable', description: 'Designed to fit in most standard home washing machines for easy maintenance.', icon: WashIcon },
  { title: 'Sustainably Sourced', description: 'Crafted from recycled natural fibers and non-toxic dyes, safe for pets and children.', icon: EcoIcon },
  { title: 'Stain Resistant', description: "Liquid-repellent barrier protects against spills, muddy paws, and life's little accidents.", icon: DropletIcon },
];

const STYLED_IMAGES = [
  { alt: 'Rug in a dining room setting', image: STOCK_IMAGES.styledDiningRoom, className: 'col-span-2 row-span-2' },
  { alt: 'Rug close up with decor detail', image: STOCK_IMAGES.styledDetail, className: 'col-span-1' },
  { alt: 'Close up of rug pile texture', image: STOCK_IMAGES.pdpThumbTexture, className: 'col-span-1' },
  { alt: 'Rug in a home office setting', image: STOCK_IMAGES.styledHomeOffice, className: 'col-span-2' },
];

export function ProductDetails({ product, related }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const relatedProducts = related.filter((p) => p.handle !== product.handle).slice(0, 4);

  return (
    <ProductProvider
      product={product}
      onSelect={(result) => {
        const url = variantUrl(product, result.selectedOptions, result.selectedVariant?.product?.handle, searchParams);
        router.replace(url, { scroll: false });
      }}
    >
      <ProductViewTracker product={product} />
      <main className="bg-canvas text-on-surface">
        <section className="mx-auto max-w-[1320px] px-6 py-6 md:px-16 md:py-8">
          <nav className="mb-[22px] flex items-center gap-2 font-sans text-[12.5px] text-on-surface-variant/80">
            <Link href="/shop" className="hover:text-secondary">
              Home
            </Link>
            <span>/</span>
            <Link href="/collections/all" className="hover:text-secondary">
              All Rugs
            </Link>
            <span>/</span>
            <span className="text-on-surface">{product.title}</span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-14">
            <ProductGallery product={product} />
            <ProductPurchasePanel product={product} />
          </div>
        </section>

        <section className="mx-auto max-w-[1320px] border-t border-surface-container-highest px-6 py-16 lg:px-16">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            {SPECS.map((spec) => (
              <div key={spec.title} className="flex flex-col gap-2">
                <spec.icon className="h-8 w-8 text-secondary" />
                <h3 className="mt-2 font-sans text-sm font-semibold text-primary">{spec.title}</h3>
                <p className="font-sans text-sm text-on-surface-variant">{spec.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[1320px] px-6 pb-16 lg:px-16">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="font-serif text-3xl text-on-surface">Styled in Your Homes</h2>
              <p className="mt-1 font-sans text-sm text-on-surface-variant">Real spaces, real Haus &amp; Harbour rugs.</p>
            </div>
          </div>
          <div className="grid h-[420px] grid-cols-2 gap-4 md:h-[600px] md:grid-cols-4">
            {STYLED_IMAGES.map((item) => (
              <div key={item.alt} className={`overflow-hidden bg-surface-container ${item.className}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image} alt={item.alt} className="h-full w-full object-cover transition-transform duration-1000 hover:scale-105" />
              </div>
            ))}
          </div>
        </section>

        {relatedProducts.length > 0 && (
          <section className="mx-auto max-w-[1320px] px-6 pb-20 lg:px-16">
            <div className="border-t border-surface-container-highest pt-16">
              <h2 className="mb-6 font-serif text-3xl text-on-surface sm:text-4xl">You may also like</h2>
              <div className="grid grid-cols-2 gap-x-3.5 gap-y-8 sm:grid-cols-4">
                {relatedProducts.map((item) => (
                  <ProductCard key={item.id} product={item} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </ProductProvider>
  );
}

function ProductViewTracker({ product }) {
  const { selectedVariant } = useProductForm();
  const variantId = selectedVariant?.id;

  useEffect(() => {
    const bus = getAnalytics();
    if (!bus) return;
    const variant = selectedVariant ?? undefined;
    bus.publish(AnalyticsEvent.PRODUCT_VIEWED, {
      products: [
        {
          id: product.id,
          title: product.title,
          price: String((variant?.price ?? product.priceRange.minVariantPrice).amount),
          vendor: product.vendor ?? '',
          variantId: variant?.id ?? '',
          variantTitle: variant?.title ?? '',
          quantity: 1,
          productType: product.productType ?? undefined,
        },
      ],
      url: window.location.href,
      shop: getAnalyticsShop(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fire on mount and whenever the selected variant changes
  }, [product.id, variantId]);

  return null;
}

function ProductGallery({ product }) {
  const images = product.images.nodes;
  const [selected, setSelected] = useState(0);

  if (!images.length) {
    return <div className="aspect-square bg-surface-container" />;
  }

  const activeImage = images[Math.min(selected, images.length - 1)];

  return (
    <div>
      <div className="relative aspect-square overflow-hidden bg-surface-container-low">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img key={activeImage.id} src={activeImage.url} alt={activeImage.altText ?? product.title} className="h-full w-full object-cover" />
      </div>
      {images.length > 1 ? (
        <div className="mt-3 flex flex-wrap gap-2.5">
          {images.map((image, i) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setSelected(i)}
              aria-label={`Show image ${i + 1}`}
              className={`h-[74px] w-[74px] shrink-0 overflow-hidden border-2 bg-surface-container-low ${i === selected ? 'border-secondary' : 'border-surface-container-high'}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function ProductPurchasePanel({ product }) {
  const { selectedVariant } = useProductForm();
  const category = categoryLabelFromTags(product.tags);
  const compareAt = selectedVariant?.compareAtPrice;
  const price = selectedVariant?.price ?? product.priceRange.minVariantPrice;
  const hasCompare = Boolean(compareAt) && Number(compareAt.amount) > Number(price.amount);
  const material = product.tags?.find((tag) => tag.startsWith('Material_'))?.replace('Material_', '');
  const colour = product.tags?.find((tag) => tag.startsWith('Color_'))?.replace('Color_', '');

  return (
    <aside>
      {category ? <p className="mb-2.5 font-sans text-xs tracking-[0.14em] text-secondary uppercase">{category} Collection</p> : null}
      <h1 className="mb-3.5 font-serif text-[28px] leading-[1.08] text-on-surface sm:text-[42px]">{product.title}</h1>
      <div className="mb-[18px] flex items-baseline gap-3">
        <span className="text-2xl font-semibold text-on-surface">{formatMoney(price)}</span>
        {hasCompare ? <span className="text-base text-on-surface-variant/60 line-through">{formatMoney(compareAt)}</span> : null}
        <span className="text-[12.5px] text-on-surface-variant/70">AUD, incl. GST</span>
      </div>
      {product.description ? <p className="mb-[26px] max-w-[520px] font-sans text-[15.5px] leading-relaxed text-on-surface-variant">{product.description}</p> : null}

      {material || colour ? (
        <div className="mb-[26px] flex gap-6 font-sans text-[13.5px] text-on-surface-variant">
          {material ? (
            <div>
              <p className="mb-0.5 text-[11px] tracking-[0.1em] text-on-surface-variant/70 uppercase">Material</p>
              {material}
            </div>
          ) : null}
          {colour ? (
            <div>
              <p className="mb-0.5 text-[11px] tracking-[0.1em] text-on-surface-variant/70 uppercase">Colour</p>
              {colour}
            </div>
          ) : null}
        </div>
      ) : null}

      <VariantSelector product={product} />
      <AddToCart product={product} />

      <div className="mt-6 grid grid-cols-1 gap-4 border-t border-surface-container-high pt-5 sm:grid-cols-3">
        <ShippingNote icon={TruckIcon} label="Free AU shipping" />
        <ShippingNote icon={ReturnIcon} label="30-day returns" />
        <ShippingNote icon={WeaveIcon} label="Hand-woven pile" />
      </div>
    </aside>
  );
}

function ShippingNote({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-2.5">
      <Icon className="h-[22px] w-[22px] shrink-0 text-secondary" />
      <span className="font-sans text-[12.5px] text-on-surface-variant">{label}</span>
    </div>
  );
}

function VariantSelector({ product }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { options, register } = useProductForm();
  const realOptions = options.filter((option) => option.name.toLowerCase() !== 'title');

  if (realOptions.length === 0) return null;

  return (
    <div className="mb-[26px] space-y-6">
      {realOptions.map((option) => {
        const selectedValue = option.values.find((v) => v.selected)?.name;
        const isColor = option.name.toLowerCase() === 'color' || option.name.toLowerCase() === 'colour';

        return (
          <div key={option.name}>
            <p className="mb-3 font-sans text-[12.5px] tracking-[0.08em] text-on-surface uppercase">
              {option.name}
              {selectedValue ? <span className="font-normal text-on-surface-variant normal-case">: {selectedValue}</span> : null}
            </p>
            <div className={isColor ? 'flex flex-wrap items-center gap-3' : 'flex flex-wrap gap-2.5'}>
              {option.values.map((value) =>
                value.handle !== product.handle ? (
                  <button
                    key={value.name}
                    type="button"
                    onClick={() => {
                      router.replace(variantUrl(product, value.selectedOptions, value.handle, searchParams), { scroll: false });
                    }}
                    className={
                      isColor
                        ? 'h-9 w-9 rounded-full border border-outline transition hover:border-secondary'
                        : 'border border-outline px-[18px] py-[11px] font-sans text-[13px] text-on-surface transition hover:border-secondary'
                    }
                    style={isColor ? { background: value.swatch?.color ?? '#999' } : undefined}
                    aria-label={isColor ? value.name : undefined}
                  >
                    {isColor ? null : value.name}
                  </button>
                ) : (
                  <button
                    key={value.name}
                    type="button"
                    aria-pressed={value.selected}
                    disabled={!value.exists}
                    {...register('optionValue', { optionName: option.name, value: value.name })}
                    aria-label={isColor ? value.name : undefined}
                    className={
                      isColor
                        ? value.selected
                          ? 'h-9 w-9 rounded-full border-2 border-secondary ring-1 ring-secondary ring-offset-2'
                          : 'h-9 w-9 rounded-full border border-outline disabled:opacity-30'
                        : value.selected
                          ? 'border border-primary bg-primary px-[18px] py-[11px] font-sans text-[13px] text-on-primary'
                          : 'border border-outline px-[18px] py-[11px] font-sans text-[13px] text-on-surface transition hover:border-secondary disabled:opacity-40'
                    }
                    style={isColor ? { background: value.swatch?.color ?? '#999' } : undefined}
                  >
                    {isColor ? null : value.name}
                    {!isColor && value.exists && !value.available ? ' · Sold out' : null}
                  </button>
                ),
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function AddToCart({ product }) {
  const { options, selectedVariant, register, formProps, errors, pending } = useProductForm();
  const addable = canAddToCart(product, options);
  const [quantity, setQuantity] = useState(1);
  const showToast = useToast();

  return (
    <div className="space-y-3.5">
      <form
        {...formProps({
          afterSubmit: () => {
            openCartDrawer();
            showToast(`${product.title} added to cart`);
          },
        })}
        className="space-y-3.5"
      >
        <input type="hidden" {...register('merchandiseId', {})} />
        <div className="flex flex-wrap gap-3">
          <div className="flex h-14 w-fit items-center border border-outline bg-surface-container-lowest">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => setQuantity((current) => Math.max(1, current - 1))}
              className="grid h-14 w-12 place-items-center text-lg text-on-surface"
            >
              -
            </button>
            <input
              type="text"
              inputMode="numeric"
              {...register('quantity', { value: quantity })}
              onChange={(event) => {
                const next = Number(event.target.value);
                setQuantity(Number.isFinite(next) && next > 0 ? Math.floor(next) : 1);
              }}
              className="h-14 w-16 border-x border-outline bg-transparent text-center text-sm font-semibold text-on-surface focus:outline-none"
            />
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => setQuantity((current) => current + 1)}
              className="grid h-14 w-12 place-items-center text-lg text-on-surface"
            >
              +
            </button>
          </div>
          <button
            type="submit"
            disabled={!addable || pending}
            className="flex h-14 flex-1 items-center justify-center bg-primary px-6 font-sans text-[13.5px] tracking-[0.13em] text-on-primary uppercase transition hover:bg-charcoal-muted disabled:cursor-not-allowed disabled:bg-surface-container-high"
          >
            {pending ? 'Adding…' : addable ? 'Add to cart' : selectedVariant === null ? 'Select options' : 'Sold out'}
          </button>
          <WishlistButton productId={product.id} size={56} className="border border-primary bg-transparent hover:bg-surface-dim" />
        </div>
        {errors.userErrors.length > 0 && <p className="font-sans text-sm text-red-600">{errors.userErrors[0].message}</p>}
      </form>

      <Link
        href="/"
        className="flex h-14 w-full items-center justify-center gap-2 border border-secondary font-sans text-xs tracking-[0.1em] text-secondary uppercase transition hover:bg-secondary/5"
      >
        <HandshakeIcon className="h-5 w-5" />
        Join our Trade Program
      </Link>

      {selectedVariant ? (
        <ShopPayButton variants={[{ id: selectedVariant.id, quantity }]} channel="hydrogen" disabled={!addable || pending} width="100%" height="56px" borderRadius="2" />
      ) : null}
    </div>
  );
}

function variantUrl(product, selectedOptions, handle = product.handle, base = new URLSearchParams()) {
  const params = new URLSearchParams(base);
  for (const option of product.options) params.delete(option.name);
  for (const option of selectedOptions) params.set(option.name, option.value);
  const query = params.toString();
  return `/products/${handle}${query ? `?${query}` : ''}`;
}

function HandshakeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" {...props}>
      <path d="M2 12h4l3-3 4 4 3-3h6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 9 4 12l3 3M17 9l3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TruckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" {...props}>
      <rect x="3" y="7" width="18" height="12" />
      <path d="M3 11h18" />
      <path d="M8 19v2M16 19v2" />
    </svg>
  );
}

function ReturnIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" {...props}>
      <path d="M4 12a8 8 0 1 1 3 6.2" strokeLinecap="round" />
      <path d="M4 19v-4h4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WeaveIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" {...props}>
      <rect x="4" y="3" width="16" height="18" />
      <line x1="9" y1="3" x2="9" y2="21" />
      <line x1="14" y1="3" x2="14" y2="21" />
    </svg>
  );
}

function WashIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="12" cy="13" r="5" />
      <path d="M9 13a3 3 0 0 0 3 3" strokeLinecap="round" />
      <circle cx="7" cy="6" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

function EcoIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" {...props}>
      <path d="M5 20c8 0 13-5 14-14-9 1-14 6-14 14Z" strokeLinejoin="round" />
      <path d="M5 20c0-5 2-8 6-10" strokeLinecap="round" />
    </svg>
  );
}

function DropletIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" {...props}>
      <path d="M12 3s6 7 6 11.5a6 6 0 1 1-12 0C6 10 12 3 12 3Z" strokeLinejoin="round" />
    </svg>
  );
}
