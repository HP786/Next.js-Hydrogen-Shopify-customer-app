import 'server-only';
import { createHash, createHmac, randomBytes, timingSafeEqual } from 'crypto';

/** @param {Buffer} input */
function base64url(input) {
  return input.toString('base64url');
}

export function randomToken(bytes = 32) {
  return base64url(randomBytes(bytes));
}

export function pkceVerifier() {
  return randomToken(32);
}

/** @param {string} verifier */
export function pkceChallenge(verifier) {
  return base64url(createHash('sha256').update(verifier).digest());
}

function secret() {
  const value = process.env.SESSION_SECRET;
  if (!value) throw new Error('SESSION_SECRET environment variable is not set');
  return value;
}

/**
 * HMAC-signs a JSON-serializable payload for storage in a cookie. Not encryption —
 * don't put anything in here the customer shouldn't see in their own browser
 * (their own tokens are fine).
 * @param {unknown} payload
 */
export function signPayload(payload) {
  const json = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = createHmac('sha256', secret()).update(json).digest('base64url');
  return `${json}.${signature}`;
}

/**
 * @template T
 * @param {string | undefined} cookieValue
 * @returns {T | null}
 */
export function verifyPayload(cookieValue) {
  if (!cookieValue) return null;
  const [json, signature] = cookieValue.split('.');
  if (!json || !signature) return null;

  const expected = createHmac('sha256', secret()).update(json).digest('base64url');
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    return JSON.parse(Buffer.from(json, 'base64url').toString('utf8'));
  } catch {
    return null;
  }
}
