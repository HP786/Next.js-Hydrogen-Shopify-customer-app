import Link from 'next/link';

import { FooterColumn } from '@/components/FooterColumn';
import { NewsletterForm } from '@/components/NewsletterForm';
import {
  BRAND_NAME,
  BUSINESS_ABN,
  BUSINESS_LEGAL_NAME,
  LOGO_URL,
  SHOWROOM_ADDRESS,
  SHOWROOM_EMAIL,
  SHOWROOM_HOURS,
  SHOWROOM_PHONE,
  SHOWROOM_TIMEZONE,
} from '@/lib/brand';
import { getFooterData } from '@/lib/footer';
import { getHeaderData } from '@/lib/header';
import { BEST_SELLERS_TAG, COLLECTION_OPTIONS, COLOR_OPTIONS, ROOM_OPTIONS, tagPageHref } from '@/lib/shop-taxonomy';

const FALLBACK_FOOTER_MENU = {
  id: 'fallback-footer',
  items: [
    { id: 'privacy', title: 'Privacy Policy', url: '/policies/privacy-policy', items: [] },
    { id: 'refund', title: 'Refund Policy', url: '/policies/refund-policy', items: [] },
    { id: 'shipping', title: 'Shipping Policy', url: '/policies/shipping-policy', items: [] },
    { id: 'terms', title: 'Terms of Service', url: '/policies/terms-of-service', items: [] },
  ],
};

const PAYMENT_METHODS = ['Visa', 'Mastercard', 'Amex', 'Afterpay', 'Zip'];

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

const QUICK_LINKS = [
  { label: 'Home', href: '/shop' },
  { label: 'All Rugs', href: '/collections/all' },
  { label: 'Best Sellers', href: tagPageHref(BEST_SELLERS_TAG) },
  { label: 'Blogs', href: '/blogs' },
  { label: 'Showroom', href: '/showroom' },
  { label: 'Trade Program', href: '/' },
  { label: 'Wishlist', href: '/wishlist' },
];

const TRADE_LINKS = [
  { key: 'benefits', title: 'Benefits', href: '/#trade-benefits' },
  { key: 'who', title: "Who it's for", href: '/#trade-who' },
  { key: 'how', title: 'How it works', href: '/#trade-how' },
  { key: 'faq', title: 'FAQ', href: '/#trade-faq' },
  { key: 'login', title: 'Log in', href: '/account/login' },
  { key: 'apply', title: 'Apply for trade', href: '/trade/registration' },
];

export async function Footer({ variant = 'shop' } = {}) {
  const isTrade = variant === 'trade';
  const [footerData, headerData] = await Promise.all([getFooterData(), getHeaderData()]);
  const menu = footerData?.menu ?? FALLBACK_FOOTER_MENU;
  const publicStoreDomain = process.env.PUBLIC_STORE_DOMAIN;
  const primaryDomainUrl = headerData?.shop?.primaryDomain?.url;
  const shopName = BRAND_NAME;

  const supportLinks = [
    ...menu.items
      .map((item) => {
        const normalized = normalizeMenuUrl(item.url, publicStoreDomain, primaryDomainUrl);
        if (!normalized) return null;
        return { key: item.id, title: item.title, ...normalized };
      })
      .filter(Boolean),
    { key: 'orders', title: 'Order Tracking', href: '/account/orders', external: false },
  ];

  return (
    <footer className="w-full bg-primary px-6 pt-11 pb-8 text-inverse-on-surface md:px-16 md:pt-[72px]">
      <div className="mx-auto flex max-w-[1320px] flex-col justify-between gap-8 border-b border-inverse-on-surface/15 pb-10 md:flex-row md:items-end md:gap-16">
        <div className="max-w-[280px]">
          <Link href={isTrade ? '/' : '/shop'} className="mb-4 block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO_URL} alt={shopName} className="h-20 w-auto brightness-0 invert" />
          </Link>
          <p className="mt-4 font-sans text-[13px] leading-relaxed text-inverse-on-surface/60">
            {isTrade
              ? 'Wholesale rugs for Australian designers, architects & retailers. Trade pricing, swatch sets and a dedicated account contact.'
              : 'Premium handmade rugs for Australian homes. Wool, jute & viscose. Designed here, woven to last.'}
          </p>
        </div>

        {isTrade ? (
          <div className="w-full md:max-w-xs">
            <FooterColumn title="Trade Program">
              {TRADE_LINKS.map((link) => (
                <Link key={link.key} href={link.href} className="text-inverse-on-surface/70 hover:text-inverse-on-surface">
                  {link.title}
                </Link>
              ))}
            </FooterColumn>
          </div>
        ) : (
          <div className="w-full md:max-w-md">
            <h3 className="mb-2 font-sans text-lg font-semibold text-inverse-on-surface">Subscribe to our emails</h3>
            <p className="mb-3 font-sans text-sm text-inverse-on-surface/60">Join our community and get updates on new arrivals and exclusive offers.</p>
            <NewsletterForm variant="dark" />
          </div>
        )}
      </div>

      {isTrade ? null : (
        <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-6 py-10 sm:grid-cols-2 md:grid-cols-5 md:gap-8">
          <FooterColumn title="Quick Links">
            {QUICK_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="text-inverse-on-surface/70 hover:text-inverse-on-surface">
                {link.label}
              </Link>
            ))}
          </FooterColumn>

          <FooterColumn title="Rug Collections">
            {COLLECTION_OPTIONS.map((item) => (
              <Link key={item.label} href={tagPageHref(item.tag)} className="text-inverse-on-surface/70 hover:text-inverse-on-surface">
                {item.label}
              </Link>
            ))}
          </FooterColumn>

          <FooterColumn title="Rug Colours">
            {COLOR_OPTIONS.map((item) => (
              <Link key={item.label} href={tagPageHref(item.tag)} className="text-inverse-on-surface/70 hover:text-inverse-on-surface">
                {item.label}
              </Link>
            ))}
          </FooterColumn>

          <FooterColumn title="Shop by Room">
            {ROOM_OPTIONS.map((item) => (
              <Link key={item.label} href={tagPageHref(item.tag)} className="text-inverse-on-surface/70 hover:text-inverse-on-surface">
                {item.label}
              </Link>
            ))}
          </FooterColumn>

          <FooterColumn title="Support">
            {supportLinks.map((item) =>
              item.external ? (
                <a key={item.key} href={item.href} target="_blank" rel="noopener noreferrer" className="text-inverse-on-surface/70 hover:text-inverse-on-surface">
                  {item.title}
                </a>
              ) : (
                <Link key={item.key} href={item.href} className="text-inverse-on-surface/70 hover:text-inverse-on-surface">
                  {item.title}
                </Link>
              ),
            )}
          </FooterColumn>
        </div>
      )}

      <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-6 border-t border-inverse-on-surface/15 py-8 sm:grid-cols-2 md:grid-cols-4">
        <InfoBlock title="Address">
          {SHOWROOM_ADDRESS.split(', ').slice(0, -1).join(', ')}
          <br />
          {SHOWROOM_ADDRESS.split(', ').slice(-1)}
        </InfoBlock>
        <InfoBlock title="Contact">
          {SHOWROOM_PHONE}
          <br />
          {SHOWROOM_EMAIL}
        </InfoBlock>
        <InfoBlock title="Business">
          {BUSINESS_LEGAL_NAME}
          <br />
          <span className="text-inverse-on-surface/55">{BUSINESS_ABN}</span>
        </InfoBlock>
        <InfoBlock title="Hours">
          {SHOWROOM_HOURS}
          <br />
          <span className="text-inverse-on-surface/55">{SHOWROOM_TIMEZONE}</span>
        </InfoBlock>
      </div>

      <div className="mx-auto flex max-w-[1320px] flex-col flex-wrap justify-between gap-4 border-t border-inverse-on-surface/15 pt-[22px] font-sans text-xs text-inverse-on-surface/55 sm:flex-row sm:items-center">
        <span>
          &copy; {new Date().getFullYear()} {BUSINESS_LEGAL_NAME} &middot; {BUSINESS_ABN}
        </span>
        <div className="flex flex-wrap items-center gap-4">
          <nav className="flex gap-5">
            {['Instagram', 'Facebook', 'TikTok'].map((social) => (
              <a key={social} href="#" className="hover:text-inverse-on-surface">
                {social}
              </a>
            ))}
          </nav>
          <div className="flex flex-wrap gap-1.5">
            {PAYMENT_METHODS.map((method) => (
              <span
                key={method}
                className="rounded-sm border border-inverse-on-surface/20 px-2 py-1 font-sans text-[10px] font-semibold tracking-wide text-inverse-on-surface/60 uppercase"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function InfoBlock({ title, children }) {
  return (
    <div>
      <h3 className="mb-2 font-sans text-xs tracking-[0.12em] text-inverse-on-surface uppercase">{title}</h3>
      <p className="font-sans text-[13.5px] leading-relaxed text-inverse-on-surface/70">{children}</p>
    </div>
  );
}
