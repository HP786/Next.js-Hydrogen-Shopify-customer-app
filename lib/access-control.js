// A product must carry `business_only` to appear on this storefront — there's
// no untagged/shared fallback. A product tagged `customer_only` as well is
// still visible here (dual-tagged = visible on both sites); a product with
// neither tag is visible on neither site.
const BUSINESS_ONLY_TAG = 'business_only';

export function isVisibleToBusiness(tags = []) {
  return tags.includes(BUSINESS_ONLY_TAG);
}

export function filterVisibleToBusiness(products = []) {
  return products.filter((product) => isVisibleToBusiness(product?.tags));
}
