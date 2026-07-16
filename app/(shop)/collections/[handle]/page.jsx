import { notFound } from 'next/navigation';

import { CollectionBrowser } from '@/components/CollectionBrowser';
import { queryCollection } from '@/lib/collection';

async function toURLSearchParams(searchParams) {
  const resolved = await searchParams;
  const params = new URLSearchParams();
  for (const [name, value] of Object.entries(resolved)) {
    if (Array.isArray(value)) {
      for (const item of value) params.append(name, item);
    } else if (value != null) {
      params.set(name, value);
    }
  }
  return params;
}

export async function generateMetadata({ params }) {
  const { handle } = await params;
  const result = await queryCollection({ handle, searchParams: new URLSearchParams() });
  return { title: result?.collection.title ?? 'Collection' };
}

export default async function CollectionPage({ params, searchParams }) {
  const { handle } = await params;
  const urlSearchParams = await toURLSearchParams(searchParams);
  const result = await queryCollection({ handle, searchParams: urlSearchParams });

  if (!result) {
    notFound();
  }

  return (
    <CollectionBrowser
      mode="collection"
      title={result.collection.title ?? ''}
      description={result.collection.description}
      handle={result.collection.handle}
      dataSearch={urlSearchParams.toString()}
      products={result.products}
      availableFilters={result.availableFilters}
    />
  );
}
