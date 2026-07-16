import { getWishlistProducts } from '@/lib/wishlist-products';

/** @param {Request} request */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const ids = searchParams.getAll('id').filter(Boolean);

  try {
    const products = await getWishlistProducts(ids);
    return Response.json({ products });
  } catch (error) {
    console.error('Wishlist lookup error:', error);
    return Response.json({ products: [] }, { status: 500 });
  }
}
