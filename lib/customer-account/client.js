import 'server-only';
import { cookies } from 'next/headers';
import { cache } from 'react';

import { customerAccountConfig, SESSION_COOKIE } from '@/lib/customer-account/config';
import { CUSTOMER_DETAILS_QUERY, TRADE_DISCOUNT_THRESHOLD_QUERY } from '@/lib/customer-account/queries';
import { isExpired, parseSession } from '@/lib/customer-account/session';

/**
 * Reads the (already-refreshed-by-proxy.js) customer session cookie.
 * Server Components can't write cookies, so token refresh happens in proxy.js,
 * not here — this is read-only and treats a still-expired token as logged out.
 */
export const getCustomerSession = cache(async () => {
  const store = await cookies();
  const session = parseSession(store.get(SESSION_COOKIE)?.value);
  if (!session || isExpired(session)) return null;
  return session;
});

export async function isLoggedIn() {
  return (await getCustomerSession()) !== null;
}

export class CustomerAccountApiError extends Error {
  /**
   * @param {string} message
   * @param {unknown} errors
   */
  constructor(message, errors) {
    super(message);
    this.errors = errors;
  }
}

/**
 * @param {string} query
 * @param {Record<string, unknown>} [variables]
 */
export async function queryCustomerAccount(query, variables) {
  const session = await getCustomerSession();
  if (!session) throw new CustomerAccountApiError('Not logged in', null);

  const response = await fetch(customerAccountConfig.graphqlUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: session.accessToken,
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await response.json();

  if (!response.ok || json.errors) {
    throw new CustomerAccountApiError('Customer Account API request failed', json.errors);
  }

  return json.data;
}

/** Deduped per-request fetch of the current customer's profile + addresses. */
export const getCustomerDetails = cache(async () => {
  const data = await queryCustomerAccount(CUSTOMER_DETAILS_QUERY);
  return data?.customer ?? null;
});

/**
 * The signed-in customer's minimum trade-order quantity, or null if they're not
 * logged in or aren't a recognized trade account (metafield unset).
 */
export const getTradeDiscountThreshold = cache(async () => {
  if (!(await isLoggedIn())) return null;
  const data = await queryCustomerAccount(TRADE_DISCOUNT_THRESHOLD_QUERY);
  const value = Number(data?.customer?.minOrderQuantity?.value);
  return Number.isFinite(value) && value > 0 ? value : null;
});
