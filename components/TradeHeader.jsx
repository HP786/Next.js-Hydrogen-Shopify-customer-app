import { cookies } from 'next/headers';
import Link from 'next/link';

import { ScrollHideChrome } from '@/components/ScrollHideChrome';
import { TradeMobileMenu } from '@/components/TradeMobileMenu';
import { BRAND_NAME, LOGO_URL } from '@/lib/brand';
import { isLoggedIn } from '@/lib/customer-account/client';

const ANCHOR_LINKS = [
  { key: 'benefits', title: 'Benefits', href: '/#trade-benefits' },
  { key: 'who', title: "Who it's for", href: '/#trade-who' },
  { key: 'how', title: 'How it works', href: '/#trade-how' },
  { key: 'faq', title: 'FAQ', href: '/#trade-faq' },
];

export async function TradeHeader() {
  const [loggedIn, cookieStore] = await Promise.all([isLoggedIn(), cookies()]);
  const hasRegistered = cookieStore.get('trade_registered')?.value === '1';

  return (
    <ScrollHideChrome>
      <header className="flex w-full flex-wrap items-center justify-center gap-x-3 gap-y-1 bg-tertiary px-4 py-2 text-center text-on-tertiary">
        <span className="font-sans text-[11px] tracking-[0.16em] uppercase">{BRAND_NAME} Trade Program</span>
        <span className="opacity-50">&middot;</span>
        <span className="font-sans text-[11px] tracking-[0.02em] normal-case opacity-90">
          Wholesale accounts for designers, architects &amp; retailers
        </span>
      </header>

      <nav data-sticky-nav className="border-b border-surface-container-high bg-canvas/95 text-on-surface backdrop-blur-md">
        <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-4 px-4 py-3.5 md:gap-6 md:px-10">
          <div className="flex items-center gap-4">
            <TradeMobileMenu loggedIn={loggedIn} hasRegistered={hasRegistered} />
            <Link href="/" className="shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={LOGO_URL} alt={BRAND_NAME} className="h-[34px] w-auto brightness-0 md:h-[42px]" />
            </Link>
          </div>

          <div className="hidden items-center gap-7 md:flex">
            {ANCHOR_LINKS.map((item) => (
              <Link key={item.key} href={item.href} className="font-sans text-[13.5px] text-on-surface transition-colors hover:text-secondary">
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </ScrollHideChrome>
  );
}
