import { redirect } from 'next/navigation';

import { AccountNav } from '@/components/AccountNav';
import { getCustomerDetails, getCustomerSession } from '@/lib/customer-account/client';

export const dynamic = 'force-dynamic';

export default async function AccountLayout({ children }) {
  const session = await getCustomerSession();
  if (!session) {
    redirect('/account/login');
  }

  const customer = await getCustomerDetails();

  return (
    <div className="mx-auto max-w-4xl px-6 py-16 text-on-surface">
      <h1 className="font-serif text-3xl text-on-surface">
        {customer?.firstName ? `Welcome, ${customer.firstName}` : 'Welcome to your account.'}
      </h1>
      <AccountNav />
      <div className="mt-10">{children}</div>
    </div>
  );
}
