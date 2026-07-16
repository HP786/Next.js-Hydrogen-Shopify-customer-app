import { handleShopifyRedirects } from '@shopify/hydrogen';
import { headers } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { getStorefrontClient } from '@/lib/storefront';

// Reading headers() and possibly redirecting must happen per-request.
export const dynamic = 'force-dynamic';

export default async function NotFound() {
  const headersList = await headers();
  const url = headersList.get('x-storefront-url');

  if (url) {
    const result = await handleShopifyRedirects({
      request: new Request(url),
      storefrontClient: await getStorefrontClient(),
    });
    if (result) {
      const location = result.headers.get('location');
      if (location) redirect(location);
    }
  }

  return (
    <main className="mx-auto max-w-xl px-6 py-24 text-center">
      <h1 className="font-serif text-4xl text-on-surface">404</h1>
      <p className="mt-4 font-sans text-on-surface-variant">The requested page could not be found.</p>
      <Link href="/" className="mt-8 inline-block font-sans text-sm font-semibold text-primary underline">
        Return home
      </Link>
    </main>
  );
}
