import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getPolicy } from '@/lib/policies';

export async function generateMetadata({ params }) {
  const { handle } = await params;
  const policy = await getPolicy(handle);
  return { title: policy?.title ?? 'Policy' };
}

export default async function PolicyPage({ params }) {
  const { handle } = await params;
  const policy = await getPolicy(handle);

  if (!policy) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-16 md:py-20">
      <Link href="/policies" className="font-sans text-sm text-on-surface-variant underline hover:text-primary">
        &larr; Back to Policies
      </Link>
      <h1 className="mt-6 font-serif text-4xl text-on-surface">{policy.title}</h1>
      <div className="mt-8 font-sans text-base leading-relaxed text-on-surface-variant" dangerouslySetInnerHTML={{ __html: policy.body }} />
    </div>
  );
}
