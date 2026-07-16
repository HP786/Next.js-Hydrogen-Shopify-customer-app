'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { ProductCard } from '@/components/ProductCard';
import { useWishlist } from '@/lib/wishlist';

export default function WishlistPage() {
  const { ids } = useWishlist();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ids.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    const params = new URLSearchParams();
    ids.forEach((id) => params.append('id', id));

    fetch(`/api/wishlist?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setProducts(data.products ?? []);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [ids]);

  return (
    <main className="mx-auto max-w-[1320px] px-6 pb-20 md:px-16">
      <div className="pt-8 pb-2 md:pt-10">
        <h1 className="mb-1.5 font-serif text-4xl text-on-surface md:text-5xl">Saved for later</h1>
        <p className="mb-8 font-sans text-[15px] text-on-surface-variant">
          {ids.length === 0 ? 'Your saved rugs will appear here.' : `${ids.length} rug${ids.length > 1 ? 's' : ''} saved`}
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3">
          {ids.map((id) => (
            <div key={id} className="aspect-[4/5] animate-pulse bg-surface-container" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="border border-dashed border-outline bg-surface-container px-5 py-[70px] text-center">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#c0a37e" strokeWidth="1.3" className="mx-auto mb-[18px]">
            <path d="M12 20s-7-4.6-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.4-7 10-7 10z" />
          </svg>
          <p className="mb-5 font-sans text-base text-on-surface-variant">Nothing saved yet. Tap the heart on any rug to keep it here.</p>
          <Link
            href="/collections/all"
            className="inline-block bg-primary px-[26px] py-[13px] font-sans text-xs tracking-[0.11em] text-on-primary uppercase transition hover:bg-charcoal-muted"
          >
            Browse rugs
          </Link>
        </div>
      ) : (
        <section className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      )}
    </main>
  );
}
