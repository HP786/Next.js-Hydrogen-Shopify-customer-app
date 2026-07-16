import 'server-only';

const API_VERSION = '2026-07';

/** @param {string} name */
function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} environment variable is not set`);
  return value;
}

export const customerAccountConfig = {
  get clientId() {
    return required('PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID');
  },
  get authBaseUrl() {
    return required('PUBLIC_CUSTOMER_ACCOUNT_API_URL');
  },
  get shopId() {
    return required('SHOP_ID');
  },
  get graphqlUrl() {
    return `${this.authBaseUrl}/account/customer/api/${API_VERSION}/graphql`;
  },
  // These match the exact "Application endpoints" shown on the Headless
  // channel's setup page for this client — not derived, to avoid drift.
  get authorizeUrl() {
    return `https://shopify.com/authentication/${this.shopId}/oauth/authorize`;
  },
  get tokenUrl() {
    return `https://shopify.com/authentication/${this.shopId}/oauth/token`;
  },
  get logoutUrl() {
    return `https://shopify.com/authentication/${this.shopId}/logout`;
  },
  scope: 'openid email customer-account-api:full',
};

export const SESSION_COOKIE = 'customer_session';
export const OAUTH_STATE_COOKIE = 'customer_oauth_state';
