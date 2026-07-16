import 'server-only';
import { gql } from '@shopify/hydrogen';

import { filterVisibleToCustomer } from '@/lib/access-control';
import { PRODUCT_CARD_FIELDS } from '@/lib/product-card-fields';
import { getStorefrontClient } from '@/lib/storefront';

const HOME_QUERY = gql(
  `
  query Home {
    featuredCollections: collections(first: 2, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        id
        title
        handle
        description
        image {
          id
          url
          altText
          width
          height
        }
      }
    }
    mostPopularProducts: products(first: 8, query: "tag:Most_Popular") {
      nodes {
        ...HomeProductFields
      }
    }
    recentProducts: products(first: 8, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...HomeProductFields
      }
    }
  }
`,
  [PRODUCT_CARD_FIELDS],
);

export async function getHomeData() {
  const storefrontClient = await getStorefrontClient();
  const { data } = await storefrontClient.graphql(HOME_QUERY);
  const collections = data?.featuredCollections?.nodes ?? [];

  // Prefer products tagged "Most_Popular" (merchant-curated); pad with the most
  // recently updated products so the section never looks sparse while more items
  // are still being tagged.
  const tagged = filterVisibleToCustomer(data?.mostPopularProducts?.nodes ?? []);
  const recent = filterVisibleToCustomer(data?.recentProducts?.nodes ?? []);
  const taggedIds = new Set(tagged.map((p) => p.id));
  const recommendedProducts = [...tagged, ...recent.filter((p) => !taggedIds.has(p.id))].slice(0, 8);

  return {
    featuredCollection: collections[0] ?? null,
    secondaryCollection: collections[1] ?? null,
    recommendedProducts,
  };
}
