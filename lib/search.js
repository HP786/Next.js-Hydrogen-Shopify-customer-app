import 'server-only';
import { gql, parseCollectionParams } from '@shopify/hydrogen';

import { filterVisibleToBusiness } from '@/lib/access-control';
import { PRODUCT_CARD_FIELDS } from '@/lib/product-card-fields';
import { getStorefrontClient } from '@/lib/storefront';

const PRODUCTS_PER_PAGE = 48;

const SEARCH_QUERY = gql(
  `
  query Search($term: String!, $filters: [ProductFilter!], $sortKey: SearchSortKeys, $reverse: Boolean, $first: Int!) {
    products: search(
      query: $term
      types: [PRODUCT]
      productFilters: $filters
      sortKey: $sortKey
      reverse: $reverse
      unavailableProducts: HIDE
      first: $first
    ) {
      totalCount
      productFilters {
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
        __typename
        ... on Product {
          ...HomeProductFields
        }
      }
    }
  }
`,
  [PRODUCT_CARD_FIELDS],
);

function searchBrowseVariables(term, browse) {
  const sortKey = browse.sortKey === 'PRICE' ? 'PRICE' : 'RELEVANCE';
  return {
    term,
    first: PRODUCTS_PER_PAGE,
    filters: browse.filters.length > 0 ? browse.filters : undefined,
    sortKey,
    reverse: browse.reverse || undefined,
  };
}

async function runSearch(term, searchParams) {
  const storefrontClient = await getStorefrontClient();
  const parsed = parseCollectionParams(searchParams);
  const { data } = await storefrontClient.graphql(SEARCH_QUERY, {
    variables: searchBrowseVariables(term, parsed),
  });

  const products = data?.products;
  if (!products) throw new Error('No search data returned from Shopify API');

  const productNodes = products.nodes.flatMap((node) => (node.__typename === 'Product' ? [node] : []));

  return {
    products: filterVisibleToBusiness(productNodes),
    availableFilters: products.productFilters,
    totalCount: products.totalCount,
  };
}

export async function querySearch({ searchParams }) {
  const term = searchParams.get('q')?.trim() ?? '';

  if (!term) {
    return { term, products: [], availableFilters: [], totalCount: 0 };
  }

  const result = await runSearch(term, searchParams);
  return { term, ...result };
}

// Shopify's Storefront API only exposes product facets (availability, price, etc.) through
// `collection.products` or `search`, not the root `products` connection. The "*" query is the
// standard way to browse the full catalog through `search` while keeping real filtering/sorting.
export async function queryAllProducts({ searchParams }) {
  return runSearch('*', searchParams);
}
