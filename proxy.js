import { createStorefrontClient, createStorefrontRequestContext, handleShopifyRoutes } from '@shopify/hydrogen';
import { NextResponse } from 'next/server';

import { cartHandlers } from '@/lib/cart-handlers';
import { getBuyerIp } from '@/lib/buyer-ip';
import { storefrontConfig } from '@/lib/config';
import { SESSION_COOKIE } from '@/lib/customer-account/config';
import { refreshSession } from '@/lib/customer-account/auth';
import { isExpired, parseSession, serializeSession } from '@/lib/customer-account/session';
import { ensureSalesChannelAttribute } from '@/lib/trade-channel';

/** @param {import('next/server').NextRequest} request */
export async function proxy(request) {
  const requestContext = createStorefrontRequestContext(request);
  const storefrontClient = createStorefrontClient({
    type: 'private',
    config: {
      storeDomain: storefrontConfig.storeDomain,
      i18n: storefrontConfig.i18n,
      privateStorefrontToken: process.env.PRIVATE_STOREFRONT_API_TOKEN,
      buyerIp: getBuyerIp(request.headers),
      requestContext,
    },
  });

  const shopifyRoute = await handleShopifyRoutes({
    request,
    storefrontClient,
    handlers: [cartHandlers],
  });
  if (shopifyRoute) {
    // Stamp every cart mutation with the trade-storefront attribute, including
    // the very first "add" that creates the cart — this is the only place that
    // reliably sees cart creation, since client-side navigation doesn't re-run
    // the root layout's server component.
    try {
      const { cart } = await shopifyRoute.clone().json();
      if (cart) await ensureSalesChannelAttribute(cart, storefrontClient);
    } catch {
      // Non-JSON or errored cart response (e.g. a redirect from a form post) — nothing to patch.
    }
    return shopifyRoute;
  }

  const requestHeaders = requestContext.getForwardedRequestHeaders();
  const response = NextResponse.next({ request: { headers: requestHeaders } });
  requestContext.applyResponseHeaders(response.headers);

  // Server Components can't write cookies, so a near-expiry customer session is
  // refreshed here (proxy runs before routing/rendering) rather than on read.
  const session = parseSession(request.cookies.get(SESSION_COOKIE)?.value);
  if (session && isExpired(session)) {
    const refreshed = await refreshSession(session.refreshToken);
    if (refreshed) {
      response.cookies.set(SESSION_COOKIE, serializeSession(refreshed), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
      });
    } else {
      response.cookies.delete(SESSION_COOKIE);
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|_next/data|favicon.ico).*)'],
};
