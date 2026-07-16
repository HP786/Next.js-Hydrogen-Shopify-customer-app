import { gql } from '@shopify/hydrogen';

/**
 * Extends the cart primitive's default cart shape with componentized ("bundle")
 * line items — `parentRelationship` / `lineComponents` — carried over from the
 * previous storefront so bundle products keep rendering as nested line groups.
 */
export const CART_FRAGMENT = gql(`
  fragment CartLine on CartLine {
    id
    quantity
    attributes {
      key
      value
    }
    cost {
      totalAmount {
        amount
        currencyCode
      }
      amountPerQuantity {
        amount
        currencyCode
      }
      compareAtAmountPerQuantity {
        amount
        currencyCode
      }
    }
    merchandise {
      ... on ProductVariant {
        id
        availableForSale
        compareAtPrice {
          amount
          currencyCode
        }
        price {
          amount
          currencyCode
        }
        requiresShipping
        title
        image {
          id
          url
          altText
          width
          height
        }
        product {
          handle
          title
          id
          vendor
          tags
        }
        selectedOptions {
          name
          value
        }
      }
    }
    parentRelationship {
      parent {
        id
      }
    }
  }
  fragment CartLineComponent on ComponentizableCartLine {
    id
    quantity
    attributes {
      key
      value
    }
    cost {
      totalAmount {
        amount
        currencyCode
      }
      amountPerQuantity {
        amount
        currencyCode
      }
      compareAtAmountPerQuantity {
        amount
        currencyCode
      }
    }
    merchandise {
      ... on ProductVariant {
        id
        availableForSale
        compareAtPrice {
          amount
          currencyCode
        }
        price {
          amount
          currencyCode
        }
        requiresShipping
        title
        image {
          id
          url
          altText
          width
          height
        }
        product {
          handle
          title
          id
          vendor
          tags
        }
        selectedOptions {
          name
          value
        }
      }
    }
    lineComponents {
      ...CartLine
    }
  }
  fragment CartFragment on Cart {
    updatedAt
    id
    appliedGiftCards {
      id
      lastCharacters
      amountUsed {
        amount
        currencyCode
      }
    }
    checkoutUrl
    totalQuantity
    buyerIdentity {
      countryCode
      customer {
        id
        email
        firstName
        lastName
        displayName
      }
      email
      phone
    }
    lines(first: 250) {
      nodes {
        ...CartLine
        ...CartLineComponent
      }
    }
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
      totalDutyAmount {
        amount
        currencyCode
      }
      totalTaxAmount {
        amount
        currencyCode
      }
    }
    note
    attributes {
      key
      value
    }
    discountCodes {
      code
      applicable
    }
  }
`);
