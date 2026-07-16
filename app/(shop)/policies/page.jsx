import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getPolicies } from '@/lib/policies';

export const metadata = {
  title: 'Policies',
};

export default async function PoliciesPage() {
  const policies = await getPolicies();

  if (policies.length === 0) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-16 md:py-20">
      <h1 className="font-serif text-4xl text-on-surface">Policies</h1>
      <div className="mt-10 divide-y divide-surface-container-high border-y border-surface-container-high font-sans">
        {policies.map((policy) => (
          <Link key={policy.id} href={`/policies/${policy.handle}`} className="block py-4 font-medium text-on-surface hover:text-primary">
            {policy.title}
          </Link>
        ))}
      </div>
    </main>
  );
}
