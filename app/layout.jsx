import localFont from 'next/font/local';
import { Sora } from 'next/font/google';
import Script from 'next/script';
import { Suspense } from 'react';

import { AnalyticsTracker } from '@/components/AnalyticsTracker';
import { CartDrawer } from '@/components/CartDrawer';
import { ChatWidget } from '@/components/ChatWidget';
import { Providers } from '@/components/Providers';
import { BRAND_NAME } from '@/lib/brand';
import { getTradeDiscountThreshold } from '@/lib/customer-account/client';
import { getHeaderData } from '@/lib/header';
import { getInitialCart } from '@/lib/initial-cart';
import { getShopAnalyticsData } from '@/lib/shop-analytics';

import './globals.css';

// Ivy Presto Display — used only for the display-serif hero headline treatment.
const display = localFont({
  src: './fonts/IvyPrestoDisplay.woff2',
  weight: '400',
  style: 'normal',
  variable: '--font-display-raw',
  display: 'swap',
});

const body = Sora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

export async function generateMetadata() {
  const header = await getHeaderData();
  return {
    title: { default: BRAND_NAME, template: `%s · ${BRAND_NAME}` },
    description: header?.shop?.description ?? undefined,
  };
}

export default async function RootLayout({ children }) {
  const [cart, shop, minOrderQuantity] = await Promise.all([getInitialCart(), getShopAnalyticsData(), getTradeDiscountThreshold()]);

  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="bg-canvas font-sans text-on-surface selection:bg-secondary-container">
        <Providers cart={cart}>
          <Suspense fallback={null}>
            <AnalyticsTracker shop={shop} />
          </Suspense>
          {children}
          <CartDrawer minOrderQuantity={minOrderQuantity} />
          <ChatWidget />
        </Providers>
        <Script
          src="https://cdn.shopify.com/storefront/standard-actions.js"
          type="module"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
