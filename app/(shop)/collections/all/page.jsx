import { CollectionBrowser } from '@/components/CollectionBrowser';
import { queryAllProducts } from '@/lib/search';

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

export const metadata = {
  title: 'All Rugs',
};

export default async function AllProductsPage({ searchParams }) {
  const urlSearchParams = await toURLSearchParams(searchParams);
  const result = await queryAllProducts({ searchParams: urlSearchParams });

  return (
    <CollectionBrowser
      mode="catalog"
      dataSearch={urlSearchParams.toString()}
      products={result.products}
      availableFilters={result.availableFilters}
      totalCount={result.totalCount}
    />
  );
}
