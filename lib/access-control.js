// A product must carry `customer_only` to appear on this storefront — there's
// no untagged/shared fallback. A product tagged `business_only` as well is
// still visible here (dual-tagged = visible on both sites); a product with
// neither tag is visible on neither site.
const CUSTOMER_ONLY_TAG = 'customer_only';

export function isVisibleToCustomer(tags = []) {
  return tags.includes(CUSTOMER_ONLY_TAG);
}

export function filterVisibleToCustomer(products = []) {
  return products.filter((product) => isVisibleToCustomer(product?.tags));
}
