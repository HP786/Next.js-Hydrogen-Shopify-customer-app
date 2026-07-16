import 'server-only';

import { customerAccountConfig } from '@/lib/customer-account/config';
import { pkceChallenge, pkceVerifier, randomToken } from '@/lib/customer-account/crypto';

/** @param {string} redirectUri */
export function createOAuthState(redirectUri) {
  return {
    state: randomToken(16),
    codeVerifier: pkceVerifier(),
    redirectUri,
  };
}

/**
 * @param {{redirectUri: string, acrValues?: string, loginHint?: string, loginHintMode?: string, locale?: string}} options
 * @param {string} state
 * @param {string} codeVerifier
 */
export function buildAuthorizeUrl({ redirectUri, acrValues, loginHint, loginHintMode, locale }, state, codeVerifier) {
  const url = new URL(customerAccountConfig.authorizeUrl);
  url.searchParams.set('client_id', customerAccountConfig.clientId);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', customerAccountConfig.scope);
  url.searchParams.set('state', state);
  url.searchParams.set('code_challenge', pkceChallenge(codeVerifier));
  url.searchParams.set('code_challenge_method', 'S256');
  url.searchParams.set('nonce', randomToken(16));
  if (acrValues) url.searchParams.set('acr_values', acrValues);
  if (loginHint) url.searchParams.set('login_hint', loginHint);
  if (loginHintMode) url.searchParams.set('login_hint_mode', loginHintMode);
  if (locale) url.searchParams.set('locale', locale);
  return url.toString();
}

/** @param {{access_token: string, refresh_token: string, id_token: string, expires_in: number}} tokens */
function toSession(tokens) {
  return {
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    idToken: tokens.id_token,
    expiresAt: Date.now() + tokens.expires_in * 1000,
  };
}

/**
 * @param {string} code
 * @param {string} codeVerifier
 * @param {string} redirectUri
 */
export async function exchangeCodeForSession(code, codeVerifier, redirectUri) {
  const response = await fetch(customerAccountConfig.tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: customerAccountConfig.clientId,
      redirect_uri: redirectUri,
      code,
      code_verifier: codeVerifier,
    }),
  });

  if (!response.ok) {
    throw new Error(`Customer Account token exchange failed: ${response.status} ${await response.text()}`);
  }

  return toSession(await response.json());
}

/** @param {string} refreshToken */
export async function refreshSession(refreshToken) {
  const response = await fetch(customerAccountConfig.tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: customerAccountConfig.clientId,
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) return null;

  return toSession(await response.json());
}

/**
 * @param {string} idToken
 * @param {string} postLogoutRedirectUri
 */
export function buildLogoutUrl(idToken, postLogoutRedirectUri) {
  const url = new URL(customerAccountConfig.logoutUrl);
  url.searchParams.set('id_token_hint', idToken);
  url.searchParams.set('post_logout_redirect_uri', postLogoutRedirectUri);
  return url.toString();
}
