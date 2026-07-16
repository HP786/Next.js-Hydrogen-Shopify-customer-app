import 'server-only';
import { gql } from '@shopify/hydrogen';

import { filterVisibleToBusiness } from '@/lib/access-control';
import { PRODUCT_CARD_FIELDS } from '@/lib/product-card-fields';
import { getStorefrontClient } from '@/lib/storefront';

// Uses the `products` root field's freeform query syntax (`tag:X`), which reliably
// filters by tag regardless of the store's Search & Discovery filter configuration.
// The `search`/`collection.products` fields' structured `productFilters` argument
// silently ignores tags that aren't configured as discoverable storefront filters,
// so it can't be used for this — this is the one mechanism that actually works.
// Multiple tags combine with AND (confirmed against the live store).
const PRODUCTS_BY_TAG_QUERY = gql(
  `
  query ProductsByTag($query: String!, $first: Int!) {
    products(first: $first, query: $query) {
      nodes {
        ...HomeProductFields
      }
    }
  }
`,
  [PRODUCT_CARD_FIELDS],
);

export async function queryProductsByTags(tags, { first = 48 } = {}) {
  const storefrontClient = await getStorefrontClient();
  const query = tags.map((tag) => `tag:${tag}`).join(' AND ');
  const { data } = await storefrontClient.graphql(PRODUCTS_BY_TAG_QUERY, {
    variables: { query, first },
  });
  return filterVisibleToBusiness(data?.products?.nodes ?? []);
}

export async function queryProductsByTag(tag, options) {
  return queryProductsByTags([tag], options);
}
