import { getSelectedProductOptions } from '@shopify/hydrogen';
import { notFound } from 'next/navigation';

import { ProductDetails } from '@/components/ProductDetails';
import { getProductData } from '@/lib/product';

function toURLSearchParams(input) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(input)) {
    if (Array.isArray(value)) {
      for (const item of value) params.append(key, item);
    } else if (value != null) {
      params.set(key, value);
    }
  }
  return params;
}

export async function generateMetadata({ params, searchParams }) {
  const { handle } = await params;
  const selectedOptions = getSelectedProductOptions(toURLSearchParams((await searchParams) ?? {}));
  const data = await getProductData(handle, selectedOptions);
  return {
    title: data?.product?.seo?.title || data?.product?.title || 'Product',
    description: data?.product?.seo?.description || undefined,
  };
}

export default async function ProductPage({ params, searchParams }) {
  const { handle } = await params;
  const selectedOptions = getSelectedProductOptions(toURLSearchParams((await searchParams) ?? {}));
  const data = await getProductData(handle, selectedOptions);

  if (!data?.product) {
    notFound();
  }

  return <ProductDetails product={data.product} related={data.products?.nodes ?? []} />;
}
