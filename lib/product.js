import 'server-only';
import { gql } from '@shopify/hydrogen';

import { filterVisibleToCustomer, isVisibleToCustomer } from '@/lib/access-control';
import { PRODUCT_CARD_FIELDS } from '@/lib/product-card-fields';
import { getStorefrontClient } from '@/lib/storefront';

const VARIANT_FIELDS = gql(`
  fragment VariantFields on ProductVariant {
    id
    title
    availableForSale
    selectedOptions {
      name
      value
    }
    price {
      amount
      currencyCode
    }
    compareAtPrice {
      amount
      currencyCode
    }
    image {
      id
      url
      altText
      width
      height
    }
    product {
      title
      handle
    }
    sku
  }
`);

export const PRODUCT_QUERY = gql(
  `
  query Product($handle: String!, $selectedOptions: [SelectedOptionInput!]!) {
    product(handle: $handle) {
      id
      handle
      title
      vendor
      description
      tags
      requiresSellingPlan
      encodedVariantExistence
      encodedVariantAvailability
      images(first: 10) {
        nodes {
          id
          url
          altText
          width
          height
        }
      }
      options {
        name
        optionValues {
          name
          firstSelectableVariant {
            ...VariantFields
          }
          swatch {
            color
            image {
              previewImage {
                url
              }
            }
          }
        }
      }
      selectedOrFirstAvailableVariant(
        selectedOptions: $selectedOptions
        ignoreUnknownOptions: true
        caseInsensitiveMatch: true
      ) {
        ...VariantFields
      }
      adjacentVariants(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
        ...VariantFields
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      seo {
        title
        description
      }
    }
    products(first: 8, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...HomeProductFields
      }
    }
  }
`,
  [VARIANT_FIELDS, PRODUCT_CARD_FIELDS],
);

export async function getProductData(handle, selectedOptions) {
  const storefrontClient = await getStorefrontClient();
  const { data, errors } = await storefrontClient.graphql(PRODUCT_QUERY, {
    variables: { handle, selectedOptions },
  });

  if (errors) {
    console.error('[hydrogen] Product query failed', errors);
    throw new Error('Product query failed');
  }

  // business_only products are reserved for the trade storefront — treat them as
  // not found here rather than rendering a product page a retail buyer can't check out.
  const productVisible = data?.product && isVisibleToCustomer(data.product.tags);

  return {
    ...data,
    product: productVisible ? data.product : null,
    products: data?.products ? { ...data.products, nodes: filterVisibleToCustomer(data.products.nodes) } : data?.products,
  };
}
