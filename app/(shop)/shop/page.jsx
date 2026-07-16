import Link from 'next/link';

import { HeroCarousel } from '@/components/HeroCarousel';
import { InstagramCarousel } from '@/components/InstagramCarousel';
import { NewsletterForm } from '@/components/NewsletterForm';
import { ProductCard } from '@/components/ProductCard';
import { getRepresentativeImages } from '@/lib/browse-sections';
import { getHomeData } from '@/lib/home';
import { BEST_SELLERS_TAG, COLLECTION_OPTIONS, tagPageHref } from '@/lib/shop-taxonomy';
import { STOCK_IMAGES } from '@/lib/stock-images';

export const metadata = {
  title: 'Home',
};

const TRUST_POINTS = [
  { title: 'Hand-woven, not printed', description: 'Every rug knotted or tufted by hand', icon: LoomIcon },
  { title: 'NZ wool, jute & viscose', description: 'Natural fibres, low-VOC dyes', icon: WoolIcon },
  { title: 'Warners Bay showroom', description: 'See & feel before you buy', icon: PinIcon },
  { title: 'Free shipping & returns', description: 'Australia-wide, 30-day window', icon: TruckIcon },
];

const REVIEWS = [
  { text: 'Amazing rug. Super soft and ready to go straight out of the bag. Gives off a little fluff at first but a vacuum sorts it. Great rug overall, highly recommend.', name: 'Todd W.', initial: 'T' },
  { text: 'Love the design and pattern, and the colour is true to the photos. On a wooden floor you may want an underlay grip. Excellent purchase.', name: 'Estelle S.', initial: 'E' },
  { text: 'Love the rug, soft and gorgeous, with quick delivery. Exactly what I was hoping for.', name: 'Timothy O.', initial: 'T' },
  { text: 'Great quality rug for a great price. Would definitely buy from here again.', name: 'Ania M.', initial: 'A' },
  { text: 'Photos reflect the rug accurately. Beautiful pattern and great quality. Customer service was fantastic too.', name: 'Medina', initial: 'M' },
  { text: 'Beautiful quality. Feels lovely underfoot and looks even better in person.', name: 'Jacqueline A.', initial: 'J' },
  { text: 'Lovely rug, thank you. The colour anchors the whole room.', name: 'Alicia H.', initial: 'A' },
  { text: 'Beautiful rug, soft and well made. Delighted with it.', name: 'Nicole T.', initial: 'N' },
];

const INSTAGRAM_SLIDES = [
  { isHandle: true, src: STOCK_IMAGES.moodyHero, alt: 'Follow Haus & Harbour on Instagram' },
  { src: STOCK_IMAGES.instaMoodyBedroom, alt: 'Moody bedroom styled with a rust Haus & Harbour rug', caption: 'Transform your space this season' },
  { src: STOCK_IMAGES.instaPetOnRug, alt: 'Dog resting on an ivory Haus & Harbour rug', caption: 'Where pets meet better rugs' },
  { src: STOCK_IMAGES.instaHallway, alt: 'Sunlit hallway styled with a Haus & Harbour runner', caption: 'Soft underfoot, warm all season' },
  { src: STOCK_IMAGES.instaDiningArea, alt: 'Modern dining area with a geometric Haus & Harbour rug', caption: 'Styled for every gathering' },
  { src: STOCK_IMAGES.instaReadingNook, alt: 'Cozy reading nook styled with a Haus & Harbour rug', caption: 'Slow mornings, woven in' },
];

export default async function HomePage() {
  const [{ featuredCollection, secondaryCollection, recommendedProducts }, collectionImages] = await Promise.all([
    getHomeData(),
    getRepresentativeImages(COLLECTION_OPTIONS),
  ]);

  const heroImages = [featuredCollection?.image, secondaryCollection?.image, ...Object.values(collectionImages)]
    .filter((image) => image?.url)
    .slice(0, 3);
  if (heroImages.length === 0) heroImages.push({ url: STOCK_IMAGES.moodyHero, altText: 'Haus & Harbour rug styled in a living room' });

  const bestSellersBanner = recommendedProducts[0]?.featuredImage ?? { url: STOCK_IMAGES.foundationTexture, altText: 'Best sellers' };
  const newArrivalsBanner = recommendedProducts[1]?.featuredImage ?? { url: STOCK_IMAGES.styledHomeOffice, altText: 'New arrivals' };

  return (
    <main className="bg-canvas text-on-surface">
      {/* HERO */}
      <section className="flex flex-wrap items-stretch bg-surface-dim">
        <div className="flex flex-1 flex-col justify-center px-6 py-14 md:basis-[400px] md:px-16 md:py-[88px]">
          <span className="mb-5 font-sans text-xs tracking-[0.22em] text-secondary uppercase">The Winter Collection</span>
          <h1 className="mb-[22px] font-display text-[38px] leading-[1.02] tracking-[-0.01em] font-normal italic text-on-surface sm:text-6xl lg:text-[74px]">
            Wool underfoot,
            <br />
            woven to last.
          </h1>
          <p className="mb-[34px] max-w-[440px] font-sans text-[16.5px] leading-relaxed text-on-surface-variant">
            Hand-tufted New Zealand wool, jute and viscose rugs, made for Australian homes and backed by a 30-day return.
          </p>
          <Link
            href="/collections/all"
            className="inline-block self-start rounded-md bg-primary px-[34px] py-4 font-sans text-[13.5px] tracking-[0.14em] text-on-primary uppercase transition hover:bg-charcoal-muted"
          >
            Shop the collection &rarr;
          </Link>
        </div>
        <div className="relative min-h-[360px] flex-[1.35_1_460px] overflow-hidden bg-surface-container-high sm:min-h-[58vh] lg:min-h-[660px]">
          <HeroCarousel images={heroImages} />
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-b border-surface-container-high bg-canvas">
        <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-[26px] px-6 py-[26px] sm:grid-cols-2 md:px-16 lg:grid-cols-4">
          {TRUST_POINTS.map((point) => (
            <div key={point.title} className="flex items-center gap-3.5">
              <point.icon className="h-[26px] w-[26px] shrink-0 text-secondary" />
              <div>
                <p className="text-sm font-semibold text-on-surface">{point.title}</p>
                <p className="text-[12.5px] text-on-surface-variant">{point.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* COLLECTIONS MOSAIC */}
      <section className="mx-auto max-w-[1320px] px-6 py-16 md:px-16 md:py-[90px]">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="block font-sans text-xs tracking-[0.2em] text-secondary uppercase">Shop by</span>
            <h2 className="mt-2 font-sans text-[28px] font-semibold text-on-surface md:text-[44px]">Collections</h2>
          </div>
          <Link href="/collections/all" className="border-b border-on-surface pb-0.5 font-sans text-[13.5px] tracking-wide text-on-surface">
            View all rugs
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-6">
          {COLLECTION_OPTIONS.map((item) => {
            const image = collectionImages[item.label];
            return (
              <Link key={item.label} href={tagPageHref(item.tag)} className="group relative aspect-[3/4] overflow-hidden bg-surface-container-high">
                {image?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={image.url} alt={image.altText ?? item.label} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent to-[55%]" />
                <span className="absolute bottom-3.5 left-4 font-serif text-[21px] text-white">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* SPLIT BANNERS */}
      <section className="grid grid-cols-1 sm:grid-cols-2">
        <BannerTile
          href={tagPageHref(BEST_SELLERS_TAG)}
          image={bestSellersBanner}
          title="Best Sellers"
          copy="The rugs our customers keep coming back for: soft, hard-wearing, room-ready."
          cta="Shop best sellers"
          gradient="linear-gradient(90deg,rgba(20,18,14,.5),rgba(20,18,14,.05))"
        />
        <BannerTile
          href="/collections/all"
          image={newArrivalsBanner}
          title="New Arrivals"
          copy="Fresh weaves and seasonal tones, added to the Rug Library every month."
          cta="Shop new in"
          gradient="linear-gradient(90deg,rgba(35,48,60,.55),rgba(35,48,60,.05))"
        />
      </section>

      {/* MOST LOVED RUGS */}
      {recommendedProducts.length > 0 ? (
        <section className="mx-auto max-w-[1320px] px-6 py-16 md:px-16 md:py-[90px]">
          <div className="mb-[38px] text-center">
            <span className="font-sans text-xs tracking-[0.2em] text-secondary uppercase">Popular right now</span>
            <h2 className="mt-2 font-sans text-[28px] font-semibold text-on-surface md:text-[44px]">Most Loved Rugs</h2>
          </div>
          <div className="grid grid-cols-2 gap-x-3.5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {recommendedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ) : null}

      {/* TRADE BAND */}
      <section className="relative overflow-hidden bg-tertiary text-on-tertiary">
        <div className="relative mx-auto max-w-[900px] px-5 py-[52px] text-center sm:py-[104px] md:px-10">
          <span className="font-sans text-xs tracking-[0.22em] text-[#c79a6a] uppercase">Trade &amp; Commercial</span>
          <h2 className="mt-4 mb-[18px] font-sans text-[28px] leading-[1.1] font-semibold md:text-5xl">Designers, architects &amp; stylists &mdash; work with us.</h2>
          <p className="mx-auto mb-[30px] max-w-[560px] font-sans text-base leading-relaxed text-[#c7cdd3]">
            Exclusive trade pricing, generous samples, and a team who knows the difference between a 200&times;290 and a 240&times;330 in a real room.
          </p>
          <Link href="/" className="inline-block rounded-md bg-on-tertiary px-8 py-[15px] font-sans text-[13px] tracking-[0.13em] text-tertiary uppercase transition hover:bg-white">
            Register Today
          </Link>
        </div>
      </section>

      {/* REVIEWS MARQUEE */}
      <section className="overflow-hidden bg-canvas py-16 md:py-[88px]">
        <div className="mb-9 px-5 text-center">
          <p className="mb-3 text-secondary">★★★★★</p>
          <h2 className="font-sans text-[26px] font-semibold text-on-surface md:text-[42px]">Loved by 4,000+ homes</h2>
        </div>
        <div className="[mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)] overflow-hidden">
          <div className="flex w-max animate-[hh-marquee_55s_linear_infinite] gap-5 hover:[animation-play-state:paused]">
            {[...REVIEWS, ...REVIEWS].map((review, i) => (
              <div key={i} className="flex w-80 flex-col gap-3.5 border border-surface-container-high bg-surface px-6 py-[26px]">
                <span className="text-sm tracking-widest text-secondary">★★★★★</span>
                <p className="flex-1 font-sans text-[14.5px] leading-relaxed text-on-surface-variant">{review.text}</p>
                <div className="flex items-center gap-2.5">
                  <span className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-surface-dim text-sm font-semibold text-secondary">
                    {review.initial}
                  </span>
                  <div>
                    <p className="text-[13.5px] font-semibold text-on-surface">{review.name}</p>
                    <p className="text-[11.5px] text-on-surface-variant/70">Verified buyer</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INSTAGRAM */}
      <section className="bg-canvas py-16 md:py-[88px]">
        <h2 className="mx-auto mb-7 max-w-[1320px] px-5 font-sans text-[28px] font-semibold text-on-surface md:px-16 md:text-[38px]">
          Instagram Posts
        </h2>
        <InstagramCarousel slides={INSTAGRAM_SLIDES} />
      </section>

      {/* NEWSLETTER */}
      <section className="bg-surface-dim px-5 py-16 text-center md:py-20">
        <h2 className="mb-2.5 font-sans text-2xl font-semibold text-on-surface md:text-4xl">Join the Haus list</h2>
        <p className="mb-[26px] font-sans text-[15px] text-on-surface-variant">New arrivals, styling notes and the occasional showroom sale. No spam.</p>
        <div className="mx-auto max-w-[440px]">
          <NewsletterForm />
        </div>
      </section>
    </main>
  );
}

function BannerTile({ href, image, title, copy, cta, gradient }) {
  return (
    <div className="relative min-h-[300px] overflow-hidden bg-surface-container-highest sm:min-h-[38vw] sm:max-h-[440px]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image.url} alt={image.altText ?? title} className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 flex flex-col justify-center px-7 py-10 text-white md:px-[60px]" style={{ background: gradient }}>
        <h3 className="mb-2.5 font-sans text-[26px] font-semibold md:text-4xl">{title}</h3>
        <p className="mb-5 max-w-xs font-sans text-[15px] leading-relaxed text-white/90">{copy}</p>
        <Link href={href} className="w-fit rounded-md bg-white px-6 py-3 font-sans text-sm font-medium text-primary transition hover:bg-surface-dim">
          {cta}
        </Link>
      </div>
    </div>
  );
}

function LoomIcon(props) {
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

function WoolIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" {...props}>
      <circle cx="12" cy="14" r="6" />
      <path d="M12 8V3M8.5 8.5 6 5M15.5 8.5 18 5" />
    </svg>
  );
}

function PinIcon(props) {
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

