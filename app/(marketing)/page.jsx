import Link from 'next/link';

import { TradeFaqAccordion } from '@/components/TradeFaqAccordion';
import { TradeHeroParallax } from '@/components/TradeHeroParallax';
import { STOCK_IMAGES } from '@/lib/stock-images';

export const metadata = {
  title: 'Trade Program',
};

const BENEFITS = [
  {
    label: 'Trade pricing',
    description: 'Preferential rates across every collection, from viscose weaves to hand-tufted wool.',
    icon: PaymentsIcon,
  },
  {
    label: 'Swatch sets on request',
    description: 'Real NZ wool, jute and viscose samples sent to your studio, free of charge.',
    icon: SparkleIcon,
  },
  {
    label: 'Showroom access',
    description: 'Bring clients to Warners Bay to see and feel a rug before it’s specified.',
    icon: SupportIcon,
  },
  {
    label: 'Priority freight',
    description: 'Trade orders are packed and dispatched ahead of the retail queue.',
    icon: TruckIcon,
  },
  {
    label: 'Spec sheets & imagery',
    description: 'High-res product shots and material specs for decks and client presentations.',
    icon: SpecSheetIcon,
  },
  {
    label: 'A dedicated contact',
    description: 'One point of contact for quotes, lead times and order changes.',
    icon: ContactIcon,
  },
];

const WHO_ITS_FOR = [
  { title: 'Interior designers & decorators', description: 'Residential and commercial fit-outs', icon: HouseIcon },
  { title: 'Architects & specifiers', description: 'Spec sheets and material samples on request', icon: BuildingIcon },
  { title: 'Retailers & showrooms', description: 'Stock our collections in your own store', icon: StoreIcon },
  { title: 'Property stylists', description: 'Staging and short-term styling projects', icon: StylistIcon },
];

const TRUST_BADGES = ['No minimum order', 'Exclusive discounts', 'Approved in one business day'];

const HOW_IT_WORKS = [
  { step: '1', title: 'Register your business', description: 'Tell us about your studio, firm or showroom. Takes about three minutes.' },
  { step: '2', title: 'We verify your details', description: 'Our trade team confirms your ABN and business type, usually within one business day.' },
  { step: '3', title: 'Log in & start browsing', description: 'Trade pricing appears automatically across the site once you’re signed in.' },
];

export default function TradeLanding() {
  return (
    <main className="bg-canvas text-on-surface">
      <section className="relative flex min-h-screen items-center overflow-hidden bg-primary">
        <TradeHeroParallax src={STOCK_IMAGES.bohoHomeOfficeDesk} alt="Haus & Harbour rug styled in a design studio office" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(14,12,9,.9),rgba(14,12,9,.6)_52%,rgba(14,12,9,.3))]" />
        <div className="relative mx-auto w-full max-w-[1320px] px-6 py-14 md:px-16 md:py-[88px]">
          <div className="max-w-[540px] animate-[hh-fade_0.7s_ease_both]">
            <h1 className="font-display mb-[18px] text-[34px] leading-[1.08] font-normal tracking-[-0.01em] text-canvas italic [text-shadow:0_2px_30px_rgba(0,0,0,.4)] sm:text-5xl lg:text-[62px]">
              A wholesale account for the trade.
            </h1>
            <p className="mb-[30px] max-w-[440px] font-sans text-[15px] leading-relaxed text-[#ece5d8] [text-shadow:0_1px_16px_rgba(0,0,0,.4)]">
              Register your studio or firm for trade pricing across every collection, free swatch sets and priority freight. Free to
              join, no minimum order.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/trade/registration"
                className="rounded-md bg-canvas px-6 py-3 text-center font-sans text-[12.5px] font-medium tracking-[0.02em] text-on-surface transition hover:bg-white"
              >
                Register Your Business
              </Link>
              <a
                href="/account/login"
                className="rounded-md border border-white/55 bg-white/[0.08] px-[22px] py-3 text-center font-sans text-[12.5px] font-medium tracking-[0.02em] text-canvas backdrop-blur-[2px] transition hover:bg-white/[0.16]"
              >
                Log In to My Account
              </a>
            </div>
            <div className="mt-[34px] flex flex-wrap gap-x-6 gap-y-3.5 border-t border-white/20 pt-[26px]">
              {TRUST_BADGES.map((label) => (
                <div key={label} className="flex items-center gap-2">
                  <CheckIcon className="h-[17px] w-[17px] shrink-0 text-[#c79a6a]" />
                  <span className="font-sans text-[12.5px] text-[#ece5d8]">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="relative h-[230vh]">
        <div className="sticky top-[62px] md:top-[71px]">
          <section id="trade-who" className="relative bg-surface-dim">
            <div className="mx-auto max-w-[1320px] px-6 py-14 md:px-16 md:py-24">
              <div className="mb-10 max-w-[640px] md:mb-[52px]">
                <span className="mb-4 block font-sans text-xs tracking-[0.22em] text-secondary uppercase">Trusted on the floor</span>
                <p className="font-display text-[24px] leading-[1.2] font-normal text-on-surface italic sm:text-[32px] md:text-[40px]">
                  From concept board to final install, a rug partner your clients notice and remember.
                </p>
              </div>
              <div className="mb-9 md:mb-11">
                <span className="font-sans text-xs tracking-[0.2em] text-secondary uppercase">Who it&rsquo;s for</span>
                <h2 className="mt-2.5 font-sans text-[26px] font-semibold text-on-surface md:text-4xl">Open to any qualifying business</h2>
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {WHO_ITS_FOR.map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-3.5 rounded-lg border border-surface-variant bg-surface p-5 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1.5 hover:border-[#c9a05a] hover:shadow-[0_18px_38px_rgba(30,25,18,0.13)]"
                  >
                    <item.icon className="mt-0.5 h-[22px] w-[22px] shrink-0 text-secondary" />
                    <div>
                      <p className="mb-1 text-[14.5px] font-semibold text-on-surface">{item.title}</p>
                      <p className="font-sans text-[13px] leading-relaxed text-on-surface-variant">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="trade-benefits" className="overflow-hidden bg-surface-dim py-10 md:py-[72px]">
            <div className="mx-auto mb-8 w-full max-w-[1320px] px-6 md:mb-11 md:px-16">
              <h2 className="font-sans text-[26px] font-semibold text-on-surface md:text-4xl">Built for studios &amp; firms</h2>
            </div>
            <div className="[mask-image:linear-gradient(90deg,transparent,#000_5%,#000_95%,transparent)] overflow-hidden">
              <div className="flex w-max animate-[hh-marquee_46s_linear_infinite] gap-6 px-6 hover:[animation-play-state:paused]">
                {[...BENEFITS, ...BENEFITS].map((benefit, i) => (
                  <div key={i} className="flex w-[300px] shrink-0 flex-col rounded-lg border border-[#e2d8c7] bg-surface p-[30px] px-[26px]" aria-hidden={i >= BENEFITS.length}>
                    <span className="mb-[18px] flex h-[46px] w-[46px] items-center justify-center rounded-full bg-[#f3ece0]">
                      <benefit.icon className="h-6 w-6 text-secondary" />
                    </span>
                    <h3 className="mb-[7px] text-base font-semibold text-on-surface">{benefit.label}</h3>
                    <p className="font-sans text-[13.5px] leading-relaxed text-[#766d5f]">{benefit.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>

      <section id="trade-how" className="bg-canvas text-[#766d5f]">
        <div className="mx-auto max-w-[1320px] px-6 py-[52px] md:px-16 md:py-[88px]">
          <div className="mb-10 md:mb-[60px]">
            <h2 className="font-sans text-[26px] font-semibold text-on-surface md:text-4xl">Three steps to a trade account</h2>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step}>
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-primary font-sans text-lg text-on-primary">
                  {item.step}
                </div>
                <p className="mb-1.5 text-base font-semibold text-on-surface">{item.title}</p>
                <p className="font-sans text-[13.5px] leading-relaxed text-[#766d5f]">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="trade-faq" className="mx-auto max-w-[1320px] px-6 py-14 md:px-16 md:py-20">
        <div className="mb-9 md:mb-11">
          <h2 className="font-sans text-[26px] font-semibold text-on-surface md:text-[38px]">Common questions</h2>
        </div>
        <TradeFaqAccordion />
      </section>
    </main>
  );
}

function CheckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PaymentsIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" {...props}>
      <rect x="4" y="3" width="16" height="18" />
      <line x1="9" y1="3" x2="9" y2="21" />
      <line x1="14" y1="3" x2="14" y2="21" />
      <line x1="4" y1="9" x2="20" y2="9" />
      <line x1="4" y1="15" x2="20" y2="15" />
    </svg>
  );
}

function SparkleIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" {...props}>
      <circle cx="12" cy="14" r="6" />
      <path d="M12 8V3M8.5 8.5 6 5M15.5 8.5 18 5" />
    </svg>
  );
}

function SupportIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" {...props}>
      <path d="M12 21s6-5.5 6-10a6 6 0 1 0-12 0c0 4.5 6 10 6 10z" />
      <circle cx="12" cy="11" r="2" />
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

function SpecSheetIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" {...props}>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M4 9h16" />
    </svg>
  );
}

function ContactIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" {...props}>
      <path d="M4 18v-3a8 8 0 0 1 16 0v3" />
      <rect x="2" y="17" width="4" height="5" rx="1" />
      <rect x="18" y="17" width="4" height="5" rx="1" />
    </svg>
  );
}

function HouseIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" {...props}>
      <path d="M4 20V9l8-5 8 5v11" />
      <path d="M9 20v-6h6v6" />
    </svg>
  );
}

function BuildingIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" {...props}>
      <path d="M3 21h18" />
      <path d="M5 21V7l7-4 7 4v14" />
      <path d="M10 21v-6h4v6" />
    </svg>
  );
}

function StoreIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" {...props}>
      <rect x="3" y="4" width="18" height="16" rx="1" />
      <path d="M3 9h18" />
    </svg>
  );
}

function StylistIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" {...props}>
      <rect x="4" y="3" width="16" height="18" />
      <path d="M8 8h8M8 12h8M8 16h5" />
    </svg>
  );
}
