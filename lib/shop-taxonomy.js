/**
 * Real tag taxonomy from the store's catalog (Category_*, Color_*, Room_* product tags).
 * `tag` is the exact literal tag on the product, used with the `products(query: "tag:X")`
 * lookup in lib/tag-products.js — the only filtering mechanism that reliably works for
 * these tags (see that file's comment for why). Each color also carries a swatch value
 * (solid color, or a gradient for "Multi") used to render plain color tiles.
 */
export const COLOR_OPTIONS = [
  { label: 'Beige', tag: 'Color_Beige', swatch: '#E4D5BC' },
  { label: 'Blue', tag: 'Color_Blue', swatch: '#5B7C99' },
  { label: 'Brown', tag: 'Color_Brown', swatch: '#6B4423' },
  { label: 'Green', tag: 'Color_Green', swatch: '#5F7350' },
  { label: 'Grey', tag: 'Color_Grey', swatch: '#8C8C88' },
  { label: 'Ivory', tag: 'Color_Ivory', swatch: '#F0EAD9' },
  { label: 'Multi', tag: 'Color_Multi', swatch: 'conic-gradient(#5B7C99, #C9A227, #A35233, #5F7350, #DDA7A0, #5B7C99)' },
  { label: 'Mustard', tag: 'Color_Mustard', swatch: '#C9A227' },
  { label: 'Peach', tag: 'Color_Peach', swatch: '#E8B796' },
  { label: 'Pink', tag: 'Color_Pink', swatch: '#DDA7A0' },
  { label: 'Red', tag: 'Color_Red', swatch: '#A13D3D' },
  { label: 'Rust', tag: 'Color_Rust', swatch: '#A35233' },
  { label: 'White', tag: 'Color_White', swatch: '#FAFAF7' },
];

export const COLLECTION_OPTIONS = [
  { label: 'Jute', tag: 'Category_Jute', handle: 'eco-weave-grey-jute-and-wool-rug' },
  { label: 'Kids', tag: 'Category_Kids', handle: 'karo-peach-kids-rug' },
  { label: 'Modern', tag: 'Category_Modern', handle: 'varen-brown-wool-rug' },
  { label: 'Traditional', tag: 'Category_Traditional', handle: 'solenne-s400' },
  { label: 'Transitional', tag: 'Category_Transitional', handle: 'zorin-grey-transitional-rug' },
  { label: 'Wool', tag: 'Category_Wool', handle: 'lior-beige-wool-rug' },
];

export const ROOM_OPTIONS = [
  { label: 'Living Room', tag: 'Room_LivingRoom' },
  { label: 'Bedroom', tag: 'Room_Bedroom' },
  { label: 'Kitchen', tag: 'Room_Kitchen' },
  { label: 'Bathroom', tag: 'Room_Bathroom' },
];

export const BEST_SELLERS_TAG = 'Most_Popular';

export const ALL_TAG_OPTIONS = [...COLOR_OPTIONS, ...COLLECTION_OPTIONS, ...ROOM_OPTIONS];

/** Accepts one tag or an array of tags; multiple tags combine (AND) in the resulting page. */
export function tagPageHref(tagOrTags) {
  const tags = Array.isArray(tagOrTags) ? tagOrTags : [tagOrTags];
  return `/tag/${tags.map(encodeURIComponent).join(',')}`;
}

export function parseTagPageValue(value) {
  return decodeURIComponent(value)
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

/** First matching Category_* tag's readable label, for the ProductCard eyebrow. */
export function categoryLabelFromTags(tags = []) {
  const match = COLLECTION_OPTIONS.find((option) => tags.includes(option.tag));
  return match?.label ?? null;
}
