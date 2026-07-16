import 'server-only';
import { gql, parseCollectionParams } from '@shopify/hydrogen';

import { filterVisibleToBusiness } from '@/lib/access-control';
import { PRODUCT_CARD_FIELDS } from '@/lib/product-card-fields';
import { getStorefrontClient } from '@/lib/storefront';

const PRODUCTS_PER_PAGE = 48;

const COLLECTION_QUERY = gql(
  `
  query Collection(
    $handle: String!
    $filters: [ProductFilter!]
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
    $first: Int!
  ) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(first: $first, filters: $filters, sortKey: $sortKey, reverse: $reverse) {
        filters {
          id
          label
          type
          presentation
          values {
            id
            label
            count
            input
            swatch {
              color
            }
          }
        }
        nodes {
          ...HomeProductFields
        }
      }
    }
  }
`,
  [PRODUCT_CARD_FIELDS],
);

function collectionBrowseVariables(handle, browse) {
  return {
    handle,
    first: PRODUCTS_PER_PAGE,
    filters: browse.filters.length > 0 ? browse.filters : undefined,
    sortKey: browse.sortKey,
    reverse: browse.reverse || undefined,
  };
}

export async function queryCollection({ handle, searchParams }) {
  const storefrontClient = await getStorefrontClient();
  const parsed = parseCollectionParams(searchParams);

  const { data } = await storefrontClient.graphql(COLLECTION_QUERY, {
    variables: collectionBrowseVariables(handle, parsed),
  });

  if (!data?.collection) return null;

  const { collection } = data;
  const products = collection.products;

  return {
    collection: {
      id: collection.id,
      handle: collection.handle,
      title: collection.title,
      description: collection.description,
    },
    products: filterVisibleToBusiness(products.nodes),
    availableFilters: products.filters,
  };
}
