import { createStorefrontClient, createStorefrontRequestContext, gql, getCartId, createCartCookie } from '@shopify/hydrogen';
import { NextResponse } from 'next/server';

import { getBuyerIp } from '@/lib/buyer-ip';
import { storefrontConfig } from '@/lib/config';

const DISCOUNT_CODES_UPDATE_MUTATION = gql(`
  mutation DiscountCodesUpdate($cartId: ID!, $discountCodes: [String!]) {
    cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
      cart {
        id
      }
      userErrors {
        message
      }
    }
  }
`);

const CART_CREATE_WITH_DISCOUNT_MUTATION = gql(`
  mutation CartCreateWithDiscount($discountCodes: [String!]) {
    cartCreate(input: { discountCodes: $discountCodes }) {
      cart {
        id
      }
      userErrors {
        message
      }
    }
  }
`);

/**
 * @param {Request} request
 * @param {{params: Promise<{code: string}>}} context
 */
export async function GET(request, { params }) {
  const { code } = await params;
  const url = new URL(request.url);

  let redirectParam = url.searchParams.get('redirect') || url.searchParams.get('return_to') || '/';
  // Prevent open-redirects (e.g. `//evil.com`).
  if (redirectParam.includes('//')) redirectParam = '/';

  const forwardedParams = new URLSearchParams(url.searchParams);
  forwardedParams.delete('redirect');
  forwardedParams.delete('return_to');
  const forwardedSearch = forwardedParams.toString();
  const redirectUrl = new URL(`${redirectParam}${forwardedSearch ? `?${forwardedSearch}` : ''}`, url.origin);

  if (!code) {
    return NextResponse.redirect(redirectUrl, 303);
  }

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

  const existingCartId = getCartId(request);
  const response = NextResponse.redirect(redirectUrl, 303);

  try {
    if (existingCartId) {
      await storefrontClient.graphql(DISCOUNT_CODES_UPDATE_MUTATION, {
        variables: { cartId: existingCartId, discountCodes: [code] },
      });
    } else {
      const { data } = await storefrontClient.graphql(CART_CREATE_WITH_DISCOUNT_MUTATION, {
        variables: { discountCodes: [code] },
      });
      const newCartId = data?.cartCreate?.cart?.id;
      if (newCartId) {
        response.headers.append('Set-Cookie', createCartCookie(newCartId));
      }
    }
  } catch (error) {
    console.error('[discount] Failed to apply discount code', error);
  }

  return response;
}
