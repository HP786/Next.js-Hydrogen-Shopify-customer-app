const FIRST_FORWARDED_IP_INDEX = 0;

// Vercel forwards the original client IP via x-forwarded-for (also x-real-ip
// as a fallback); Cloudflare uses cf-connecting-ip; Oxygen uses oxygen-buyer-ip.
export const BUYER_IP_HEADERS = ['oxygen-buyer-ip', 'cf-connecting-ip', 'x-vercel-forwarded-for', 'x-forwarded-for', 'x-real-ip'];
const FALLBACK_BUYER_IP = '127.0.0.1';

/**
 * @param {Pick<Headers, 'get'>} headers
 * @returns {string}
 */
export function getBuyerIp(headers) {
  for (const header of BUYER_IP_HEADERS) {
    const buyerIp = headers.get(header)?.split(',')[FIRST_FORWARDED_IP_INDEX]?.trim();
    if (buyerIp) return buyerIp;
  }

  // Buyer IP only affects per-buyer rate-limit isolation, not correctness —
  // fall back rather than take down the whole storefront if it's ever missing.
  console.warn(`None of ${BUYER_IP_HEADERS.join(', ')} were present; using fallback buyer IP.`);
  return FALLBACK_BUYER_IP;
}
