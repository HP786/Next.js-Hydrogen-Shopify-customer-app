import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { exchangeCodeForSession } from '@/lib/customer-account/auth';
import { OAUTH_STATE_COOKIE, SESSION_COOKIE } from '@/lib/customer-account/config';
import { parseOAuthState, serializeSession } from '@/lib/customer-account/session';

/** @param {Request} request */
export async function GET(request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  const store = await cookies();
  const oauthState = parseOAuthState(store.get(OAUTH_STATE_COOKIE)?.value);
  store.delete(OAUTH_STATE_COOKIE);

  if (!code || !state || !oauthState || oauthState.state !== state) {
    redirect('/account/login');
  }

  try {
    const session = await exchangeCodeForSession(code, oauthState.codeVerifier, oauthState.redirectUri);
    store.set(SESSION_COOKIE, serializeSession(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });
  } catch (error) {
    console.error('[customer-account] Token exchange failed', error);
    redirect('/account/login');
  }

  redirect('/account');
}
