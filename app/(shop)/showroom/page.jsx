const SHOWROOM_HERO = 'https://hausandharbour.com/cdn/shop/files/2_4.png?v=1783071263&width=1600';
const ADDRESS = 'Unit D1, 393A Macquarie Road, Warners Bay NSW 2282, Australia';

export const metadata = {
  title: 'Showroom',
};

export default function ShowroomPage() {
  return (
    <main>
      <section className="relative min-h-[260px] overflow-hidden bg-surface-container-highest sm:min-h-[34vw] sm:max-h-[400px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={SHOWROOM_HERO} alt="Haus & Harbour showroom" className="absolute inset-0 h-full w-full object-cover" />
        <div
          className="absolute inset-0 flex flex-col justify-center px-7 py-12 text-white sm:px-16 sm:py-20"
          style={{ background: 'linear-gradient(90deg,rgba(20,18,14,.55),rgba(20,18,14,.1))' }}
        >
          <span className="mb-3 font-sans text-xs tracking-[0.22em] text-[#e9c9a3] uppercase">Visit us</span>
          <h1 className="max-w-[560px] font-serif text-[30px] leading-[1.05] font-medium sm:text-6xl">See &amp; feel the wool before you buy.</h1>
        </div>
      </section>

      <section className="mx-auto max-w-[1320px] px-6 py-16 md:px-16 md:py-20">
        <div className="grid grid-cols-1 items-stretch gap-8 sm:grid-cols-2 md:gap-12">
          <div className="border border-surface-container-highest bg-surface p-6 md:p-10">
            <span className="text-[11.5px] tracking-[0.14em] text-secondary uppercase">Warners Bay &middot; NSW</span>
            <h2 className="mt-2.5 mb-[22px] font-serif text-2xl font-medium text-on-surface md:text-[34px]">Lake Macquarie Showroom</h2>

            <InfoRow icon={PinIcon}>
              {ADDRESS.split(', ').slice(0, -1).join(', ')}
              <br />
              {ADDRESS.split(', ').slice(-1)}
            </InfoRow>
            <InfoRow icon={ClockIcon}>
              Monday – Friday, 9:00 AM – 5:00 PM
              <br />
              <span className="text-on-surface-variant/70">Australian Eastern Standard Time</span>
            </InfoRow>
            <InfoRow icon={MailIcon} last>
              +61 2 8590 2323
              <br />
              hello@hausandharbour.com
            </InfoRow>

            <div className="flex flex-wrap gap-3">
              <a
                href="mailto:hello@hausandharbour.com?subject=Showroom%20visit"
                className="bg-primary px-6 py-3.5 font-sans text-[12.5px] tracking-[0.12em] text-on-primary uppercase transition hover:bg-charcoal-muted"
              >
                Book a visit
              </a>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(ADDRESS)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-primary px-6 py-3.5 font-sans text-[12.5px] tracking-[0.1em] text-on-surface uppercase transition hover:bg-surface-dim"
              >
                Get directions
              </a>
            </div>
          </div>

          <div className="relative min-h-[340px] overflow-hidden border border-surface-container-highest bg-[#dfe3e0]">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(0deg,#d3d8d3,#d3d8d3 1px,transparent 1px,transparent 40px),repeating-linear-gradient(90deg,#d3d8d3,#d3d8d3 1px,transparent 1px,transparent 40px)',
              }}
            />
            <div className="absolute top-[30%] left-[18%] h-3 w-[64%] -rotate-[8deg] bg-[#c7b79a]" />
            <div className="absolute top-[12%] left-[40%] h-[60%] w-3 bg-[#c7b79a]" />
            <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-full flex-col items-center">
              <PinIcon className="h-10 w-10" fill="#8a4b3a" stroke="#fff" strokeWidth={1.2} />
              <span className="mt-0.5 bg-primary px-[9px] py-1 text-[11px] whitespace-nowrap text-white">Haus &amp; Harbour</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function InfoRow({ icon: Icon, children, last = false }) {
  return (
    <div className={`flex gap-3 ${last ? 'mb-7' : 'mb-[18px]'}`}>
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
      <div className="font-sans text-[14.5px] leading-relaxed text-on-surface">{children}</div>
    </div>
  );
}

function PinIcon({ fill = 'none', stroke = 'currentColor', strokeWidth = 1.4, ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={strokeWidth} {...props}>
      <path d="M12 21s6-5.5 6-10a6 6 0 1 0-12 0c0 4.5 6 10 6 10z" />
      <circle cx="12" cy="11" r="2" fill={fill === 'none' ? 'none' : '#fff'} />
    </svg>
  );
}

function ClockIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function MailIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" {...props}>
      <path d="M4 6l8 6 8-6" />
      <rect x="4" y="5" width="16" height="14" />
    </svg>
  );
}
