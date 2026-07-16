import Link from 'next/link';

import { ProductCard } from '@/components/ProductCard';
import { TagFilterPicker } from '@/components/TagFilterPicker';
import { ALL_TAG_OPTIONS, BEST_SELLERS_TAG, parseTagPageValue, tagPageHref } from '@/lib/shop-taxonomy';
import { queryProductsByTags } from '@/lib/tag-products';

function labelForTag(tag) {
  if (tag === BEST_SELLERS_TAG) return 'Best Sellers';
  const match = ALL_TAG_OPTIONS.find((option) => option.tag === tag);
  if (match) return match.label;
  return tag.replace(/^[A-Za-z]+_/, '').replace(/([a-z])([A-Z])/g, '$1 $2');
}

function kindForTag(tag) {
  if (tag.startsWith('Color_')) return 'Colour';
  if (tag.startsWith('Category_')) return 'Style';
  if (tag.startsWith('Room_')) return 'Room';
  return null;
}

export async function generateMetadata({ params }) {
  const { value } = await params;
  const tags = parseTagPageValue(value);
  return { title: tags.map(labelForTag).join(' + ') };
}

export default async function TagPage({ params }) {
  const { value } = await params;
  const tags = parseTagPageValue(value);
  const products = await queryProductsByTags(tags);

  return (
    <main className="mx-auto max-w-[1440px] px-6 py-16 md:px-16 md:py-20">
      <header className="max-w-2xl">
        <h1 className="font-serif text-4xl leading-tight text-on-surface md:text-6xl">{tags.map(labelForTag).join(' + ')}</h1>
        <p className="mt-3 font-sans text-sm text-on-surface-variant/70">
          {products.length} {products.length === 1 ? 'product' : 'products'}
        </p>
      </header>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        {tags.map((tag) => {
          const remaining = tags.filter((t) => t !== tag);
          const kind = kindForTag(tag);
          return (
            <Link
              key={tag}
              href={remaining.length > 0 ? tagPageHref(remaining) : '/collections/all'}
              className="inline-flex items-center gap-1.5 border border-outline-variant px-3 py-1.5 font-sans text-xs font-semibold text-on-surface transition hover:border-primary hover:text-primary"
            >
              {kind ? <span className="text-on-surface-variant">{kind}:</span> : null}
              {labelForTag(tag)}
              <CloseIcon className="h-3 w-3" />
            </Link>
          );
        })}
        {tags.length > 1 ? (
          <Link
            href="/collections/all"
            className="font-sans text-xs font-semibold tracking-wide text-tertiary underline underline-offset-2 hover:opacity-80"
          >
            Clear all filters
          </Link>
        ) : null}
      </div>

      <div className="mt-10 flex gap-12">
        <aside className="hidden w-60 shrink-0 md:block">
          <TagFilterPicker selected={tags} />
        </aside>

        <div className="flex-1">
          {products.length > 0 ? (
            <section className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </section>
          ) : (
            <div>
              <p className="font-sans text-lg text-on-surface-variant">No products match this combination yet.</p>
              <Link href="/collections/all" className="mt-4 inline-block font-sans text-sm font-semibold text-tertiary underline">
                Browse all products
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function CloseIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
    </svg>
  );
}
