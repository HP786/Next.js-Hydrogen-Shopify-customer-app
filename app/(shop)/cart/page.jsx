import { CartContent } from '@/components/Cart';
import { getTradeDiscountThreshold } from '@/lib/customer-account/client';

export const metadata = {
  title: 'Cart',
};

export default async function CartPage() {
  const minOrderQuantity = await getTradeDiscountThreshold();
  return <CartContent minOrderQuantity={minOrderQuantity} />;
}
