import { formatMoney as kitFormatMoney } from '@shopify/hydrogen';

const DEFAULT_LOCALE = 'en-US';

/**
 * @param {import('@shopify/hydrogen/storefront-api-types').MoneyV2} money
 * @returns {string}
 */
export function formatMoney(money) {
  return kitFormatMoney(money, { locale: DEFAULT_LOCALE }).toString();
}
