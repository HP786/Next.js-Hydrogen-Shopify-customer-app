import 'server-only';
import { gql } from '@shopify/hydrogen';

import { getStorefrontClient } from '@/lib/storefront';

const SHOP_ANALYTICS_QUERY = gql(`
  query ShopAnalytics {
    shop {
      id
      paymentSettings {
        currencyCode
      }
    }
  }
`);

/** @returns {Promise<import('@shopify/hydrogen').ShopAnalytics>} */
export async function getShopAnalyticsData() {
  const storefrontClient = await getStorefrontClient();
  const { data } = await storefrontClient.graphql(SHOP_ANALYTICS_QUERY);

  return {
    shopId: data?.shop?.id ?? '',
    acceptedLanguage: 'EN',
    currency: data?.shop?.paymentSettings?.currencyCode ?? 'USD',
    hydrogenSubchannelId: process.env.PUBLIC_STOREFRONT_ID ?? '0',
  };
}
