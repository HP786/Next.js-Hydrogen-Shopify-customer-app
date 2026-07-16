import { gql } from '@shopify/hydrogen';
import { notFound } from 'next/navigation';

import { getStorefrontClient } from '@/lib/storefront';

const PAGE_QUERY = gql(`
  query Page($handle: String!) {
    page(handle: $handle) {
      handle
      id
      title
      body
      seo {
        description
        title
      }
    }
  }
`);

async function getPage(handle) {
  const storefrontClient = await getStorefrontClient();
  const { data } = await storefrontClient.graphql(PAGE_QUERY, { variables: { handle } });
  return data?.page ?? null;
}

export async function generateMetadata({ params }) {
  const { handle } = await params;
  const page = await getPage(handle);
  return {
    title: page?.seo?.title || page?.title || 'Page',
    description: page?.seo?.description || undefined,
  };
}

export default async function CustomPage({ params }) {
  const { handle } = await params;
  const page = await getPage(handle);

  if (!page) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:py-20">
      <header>
        <h1 className="font-serif text-4xl text-on-surface md:text-5xl">{page.title}</h1>
      </header>
      <main
        className="mt-8 font-sans text-base leading-relaxed text-on-surface-variant"
        dangerouslySetInnerHTML={{ __html: page.body }}
      />
    </div>
  );
}
