import { CollectionBrowser } from '@/components/CollectionBrowser';
import { querySearch } from '@/lib/search';

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

export async function generateMetadata({ searchParams }) {
  const urlSearchParams = await toURLSearchParams(searchParams);
  const term = urlSearchParams.get('q')?.trim();
  return { title: term ? `Search results for "${term}"` : 'Search' };
}

export default async function SearchPage({ searchParams }) {
  const urlSearchParams = await toURLSearchParams(searchParams);
  const result = await querySearch({ searchParams: urlSearchParams });

  return (
    <CollectionBrowser
      mode="search"
      term={result.term}
      dataSearch={urlSearchParams.toString()}
      products={result.products}
      availableFilters={result.availableFilters}
      totalCount={result.totalCount}
    />
  );
}
