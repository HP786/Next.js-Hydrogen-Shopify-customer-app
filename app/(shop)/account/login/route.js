import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { buildAuthorizeUrl, createOAuthState } from '@/lib/customer-account/auth';
import { OAUTH_STATE_COOKIE } from '@/lib/customer-account/config';
import { serializeOAuthState } from '@/lib/customer-account/session';

/** @param {Request} request */
export async function GET(request) {
  const url = new URL(request.url);
  const acrValues = url.searchParams.get('acr_values') || undefined;
  const loginHint = url.searchParams.get('login_hint') || undefined;
  const loginHintMode = url.searchParams.get('login_hint_mode') || undefined;
  const locale = url.searchParams.get('locale') || undefined;

  const redirectUri = `${url.origin}/account/authorize`;
  const oauthState = createOAuthState(redirectUri);
  const authorizeUrl = buildAuthorizeUrl({ redirectUri, acrValues, loginHint, loginHintMode, locale }, oauthState.state, oauthState.codeVerifier);

  const store = await cookies();
  store.set(OAUTH_STATE_COOKIE, serializeOAuthState(oauthState), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 10,
  });

  redirect(authorizeUrl);
}
