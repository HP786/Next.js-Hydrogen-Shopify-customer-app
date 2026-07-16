import 'server-only';

import { signPayload, verifyPayload } from '@/lib/customer-account/crypto';

/** @typedef {{accessToken: string, refreshToken: string, idToken: string, expiresAt: number}} CustomerSession */
/** @typedef {{state: string, codeVerifier: string, redirectUri: string}} OAuthState */

const REFRESH_MARGIN_MS = 60_000;

/** @param {CustomerSession} session */
export function isExpired(session) {
  return Date.now() > session.expiresAt - REFRESH_MARGIN_MS;
}

/** @param {CustomerSession} session */
export function serializeSession(session) {
  return signPayload(session);
}

/**
 * @param {string | undefined} raw
 * @returns {CustomerSession | null}
 */
export function parseSession(raw) {
  return verifyPayload(raw);
}

/** @param {OAuthState} state */
export function serializeOAuthState(state) {
  return signPayload(state);
}

/**
 * @param {string | undefined} raw
 * @returns {OAuthState | null}
 */
export function parseOAuthState(raw) {
  return verifyPayload(raw);
}
