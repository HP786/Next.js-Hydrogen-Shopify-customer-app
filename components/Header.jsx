import Link from 'next/link';

import { CartButton } from '@/components/CartButton';
import { MobileMenu } from '@/components/MobileMenu';
import { ScrollHideChrome } from '@/components/ScrollHideChrome';
import { WishlistNavLink } from '@/components/WishlistNavLink';
import { BRAND_NAME, LOGO_URL } from '@/lib/brand';
import { getRepresentativeImages } from '@/lib/browse-sections';
import { isLoggedIn } from '@/lib/customer-account/client';
import { getHeaderData } from '@/lib/header';
import { BEST_SELLERS_TAG, COLLECTION_OPTIONS, COLOR_OPTIONS, ROOM_OPTIONS, tagPageHref } from '@/lib/shop-taxonomy';

const ANNOUNCEMENTS = ['Free shipping Australia-wide', '30-day easy returns', 'Fall Collection live now'];

function normalizeMenuUrl(url, publicStoreDomain, primaryDomainUrl) {
  if (!url) return null;
  const isInternal =
    url.includes('myshopify.com') ||
    (publicStoreDomain && url.includes(publicStoreDomain)) ||
    (primaryDomainUrl && url.includes(primaryDomainUrl));

  if (!isInternal) return { href: url, external: true };

  try {
    return { href: new URL(url).pathname, external: false };
  } catch {
    return { href: url, external: false };
  }
}

export async function Header() {
  const [data, loggedIn, collectionImages] = await Promise.all([getHeaderData(), isLoggedIn(), getRepresentativeImages(COLLECTION_OPTIONS)]);
  const shop = data?.shop;
  const shopName = BRAND_NAME;
  const publicStoreDomain = process.env.PUBLIC_STORE_DOMAIN;
  const menuItems = data?.menu?.items ?? [];
  const normalizeItem = (item) => {
    const normalized = normalizeMenuUrl(item.url, publicStoreDomain, shop?.primaryDomain?.url);
    if (!normalized) return null;
    const children = (item.items ?? []).map(normalizeItem).filter(Boolean);
    return { key: item.id, title: item.title, children, ...normalized };
  };
  // Real Shopify menu items, minus "Home" (redundant with the logo) and "Catalog"
  // (redundant with New Arrivals below) — keeps merchant-managed items like Contact.
  const shopifyItems = menuItems
    .map(normalizeItem)
    .filter(Boolean)
    .filter((item) => !['home', 'catalog'].includes(item.title.trim().toLowerCase()));

  const navItems = [
    { key: 'new-arrivals', title: 'New Arrivals', href: '/collections/all', kind: 'plain' },
    { key: 'best-sellers', title: 'Best Sellers', href: tagPageHref(BEST_SELLERS_TAG), kind: 'plain' },
    { key: 'shop-by-room', title: 'Shop by Room', href: '/#room-guide', kind: 'list', items: ROOM_OPTIONS.map((r) => ({ key: r.tag, title: r.label, href: tagPageHref(r.tag) })) },
    {
      key: 'shop-by-collection',
      title: 'Collection',
      href: '/#collection-guide',
      kind: 'grid',
      items: COLLECTION_OPTIONS.map((c) => ({ key: c.tag, title: c.label, href: tagPageHref(c.tag), image: collectionImages[c.label]?.url })),
    },
    {
      key: 'shop-by-colour',
      title: 'Colours',
      href: '/#colour-guide',
      kind: 'swatches',
      items: COLOR_OPTIONS.map((c) => ({ key: c.tag, title: c.label, href: tagPageHref(c.tag), swatch: c.swatch })),
    },
    { key: 'showroom', title: 'Showroom', href: '/showroom', kind: 'plain' },
  ];

  const mobileMenuItems = [
    ...navItems.map((item) => ({ key: item.key, title: item.title, href: item.href, external: false, children: item.items ?? [] })),
    ...shopifyItems,
  ];

  return (
    <ScrollHideChrome>
      <header className="flex w-full items-center justify-center gap-8 bg-tertiary px-4 py-2 text-on-tertiary">
        {ANNOUNCEMENTS.map((line, i) => (
          <span key={line} className="flex items-center gap-8 font-sans text-[11px] tracking-[0.14em] uppercase">
            {i > 0 ? <span className="opacity-40">&middot;</span> : null}
            {line}
          </span>
        ))}
      </header>

      <nav data-sticky-nav className="border-b border-surface-container-high bg-canvas/95 text-on-surface backdrop-blur-md">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-6 py-3.5 md:gap-6 md:px-16">
          <div className="flex items-center gap-4 md:gap-10">
            <MobileMenu shopName={shopName} items={mobileMenuItems} />

            <Link href="/" className="shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={LOGO_URL} alt={BRAND_NAME} className="h-[34px] w-auto brightness-0 md:h-[42px]" />
            </Link>

            <div className="hidden items-center gap-6 md:flex">
              {navItems.map((item) => (
                <div key={item.key} className="group relative">
                  <Link
                    href={item.href}
                    className="flex items-center gap-1 py-2 font-sans text-xs font-semibold tracking-widest text-on-surface/80 uppercase transition-colors hover:text-secondary"
                  >
                    {item.title}
                    {item.items ? <ChevronDownIcon className="h-3 w-3" /> : null}
                  </Link>

                  {item.kind === 'list' ? (
                    <div className="invisible absolute top-full left-0 z-20 min-w-[200px] border border-surface-container-high bg-canvas py-2 opacity-0 shadow-lg transition-all duration-150 group-hover:visible group-hover:opacity-100">
                      {item.items.map((child) => (
                        <Link
                          key={child.key}
                          href={child.href}
                          className="block px-4 py-2 font-sans text-xs font-semibold tracking-widest text-on-surface-variant uppercase hover:bg-surface-container-low hover:text-primary"
                        >
                          {child.title}
                        </Link>
                      ))}
                    </div>
                  ) : null}

                  {item.kind === 'grid' ? (
                    <div className="invisible absolute top-full left-0 z-20 grid w-[420px] grid-cols-3 gap-3 border border-surface-container-high bg-canvas p-5 opacity-0 shadow-lg transition-all duration-150 group-hover:visible group-hover:opacity-100">
                      {item.items.map((child) => (
                        <Link key={child.key} href={child.href} className="group/tile text-center">
                          <div className="aspect-square overflow-hidden bg-surface-container">
                            {child.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={child.image}
                                alt={child.title}
                                className="h-full w-full object-cover transition-transform duration-300 group-hover/tile:scale-105"
                              />
                            ) : null}
                          </div>
                          <p className="mt-2 font-sans text-[11px] font-semibold tracking-wide text-on-surface-variant uppercase group-hover/tile:text-primary">
                            {child.title}
                          </p>
                        </Link>
                      ))}
                    </div>
                  ) : null}

                  {item.kind === 'swatches' ? (
                    <div className="invisible absolute top-full left-0 z-20 grid w-[300px] grid-cols-4 gap-4 border border-surface-container-high bg-canvas p-5 opacity-0 shadow-lg transition-all duration-150 group-hover:visible group-hover:opacity-100">
                      {item.items.map((child) => (
                        <Link key={child.key} href={child.href} className="group/swatch text-center">
                          <div
                            className="mx-auto aspect-square w-9 overflow-hidden rounded-full border border-outline-variant/40 transition-transform duration-300 group-hover/swatch:scale-110"
                            style={{ background: child.swatch }}
                          />
                          <p className="mt-1.5 font-sans text-[10px] font-semibold tracking-wide text-on-surface-variant uppercase group-hover/swatch:text-primary">
                            {child.title}
                          </p>
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}

              {shopifyItems.map((item) =>
                item.external ? (
                  <a
                    key={item.key}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-xs font-semibold tracking-widest text-on-surface/80 uppercase transition-colors hover:text-secondary"
                  >
                    {item.title}
                  </a>
                ) : (
                  <Link
                    key={item.key}
                    href={item.href}
                    className="font-sans text-xs font-semibold tracking-widest text-on-surface/80 uppercase transition-colors hover:text-secondary"
                  >
                    {item.title}
                  </Link>
                ),
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 text-on-surface md:gap-5">
            <Link href="/search" aria-label="Search" className="transition-opacity hover:opacity-70">
              <SearchIcon className="h-[19px] w-[19px]" />
            </Link>
            <WishlistNavLink />
            <Link href="/account" aria-label={loggedIn ? 'Account' : 'Sign in'} className="transition-opacity hover:opacity-70">
              <UserIcon className="h-5 w-5" />
            </Link>
            <CartButton />
          </div>
        </div>
      </nav>
    </ScrollHideChrome>
  );
}

function SearchIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}

function ChevronDownIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function UserIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c1.6-3.6 4.8-5.5 8-5.5s6.4 1.9 8 5.5" strokeLinecap="round" />
    </svg>
  );
}
