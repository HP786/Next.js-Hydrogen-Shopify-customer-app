import 'server-only';
import { gql } from '@shopify/hydrogen';

// Shared shape for every product-list query (home, collection, tag, search) —
// adds compare-at price, a couple of images (for the hover-cycle on ProductCard),
// a first-variant id (for the card's quick "Add" button), and tags (for the
// Category_* eyebrow label) on top of the original featuredImage/priceRange fields.
export const PRODUCT_CARD_FIELDS = gql(`
  fragment HomeProductFields on Product {
    id
    title
    handle
    tags
    featuredImage {
      id
      url
      altText
      width
      height
    }
    images(first: 2) {
      nodes {
        id
        url
        altText
      }
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 1) {
      nodes {
        id
        availableForSale
      }
    }
  }
`);
