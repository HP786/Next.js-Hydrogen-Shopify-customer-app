import 'server-only';
import { gql } from '@shopify/hydrogen';

import { filterVisibleToCustomer } from '@/lib/access-control';
import { PRODUCT_CARD_FIELDS } from '@/lib/product-card-fields';
import { getStorefrontClient } from '@/lib/storefront';

const WISHLIST_PRODUCTS_QUERY = gql(
  `
  query WishlistProducts($ids: [ID!]!) {
    nodes(ids: $ids) {
      __typename
      ... on Product {
        ...HomeProductFields
      }
    }
  }
`,
  [PRODUCT_CARD_FIELDS],
);

export async function getWishlistProducts(ids) {
  if (ids.length === 0) return [];
  const storefrontClient = await getStorefrontClient();
  const { data } = await storefrontClient.graphql(WISHLIST_PRODUCTS_QUERY, { variables: { ids } });
  return filterVisibleToCustomer((data?.nodes ?? []).filter((node) => node?.__typename === 'Product'));
}
