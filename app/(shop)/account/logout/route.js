import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { buildLogoutUrl } from '@/lib/customer-account/auth';
import { SESSION_COOKIE } from '@/lib/customer-account/config';
import { parseSession } from '@/lib/customer-account/session';

/** GET is a plain redirect home; logout itself is a POST (matches the account layout's logout form). */
export async function GET() {
  redirect('/');
}

/** @param {Request} request */
export async function POST(request) {
  const store = await cookies();
  const session = parseSession(store.get(SESSION_COOKIE)?.value);
  store.delete(SESSION_COOKIE);

  if (!session) {
    redirect('/');
  }

  const origin = new URL(request.url).origin;
  redirect(buildLogoutUrl(session.idToken, origin));
}
