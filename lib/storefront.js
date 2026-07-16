import 'server-only';
import { createStorefrontClient, createStorefrontRequestContext } from '@shopify/hydrogen';
import { headers } from 'next/headers';
import { cache } from 'react';

import { getBuyerIp } from '@/lib/buyer-ip';
import { storefrontConfig } from '@/lib/config';

export const getStorefrontClient = cache(async () => {
  const requestHeaders = await headers();
  const requestContext = createStorefrontRequestContext({ headers: requestHeaders });

  return createStorefrontClient({
    type: 'private',
    config: {
      storeDomain: storefrontConfig.storeDomain,
      i18n: storefrontConfig.i18n,
      privateStorefrontToken: process.env.PRIVATE_STOREFRONT_API_TOKEN,
      buyerIp: getBuyerIp(requestHeaders),
      requestContext,
    },
  });
});
