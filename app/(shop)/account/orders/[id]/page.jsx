import Link from 'next/link';
import { notFound } from 'next/navigation';

import { queryCustomerAccount } from '@/lib/customer-account/client';
import { CUSTOMER_ORDER_QUERY } from '@/lib/customer-account/queries';
import { formatMoney } from '@/lib/money';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const order = await getOrder(id);
  return { title: order ? `Order ${order.name}` : 'Order' };
}

async function getOrder(encodedId) {
  let orderId;
  try {
    orderId = atob(decodeURIComponent(encodedId));
  } catch {
    return null;
  }

  const data = await queryCustomerAccount(CUSTOMER_ORDER_QUERY, { orderId });
  return data?.order ?? null;
}

export default async function OrderDetailPage({ params }) {
  const { id } = await params;
  const order = await getOrder(id);

  if (!order) {
    notFound();
  }

  const lineItems = order.lineItems.nodes;
  const discountApplications = order.discountApplications.nodes;
  const fulfillmentStatus = order.fulfillments.nodes[0]?.status ?? 'N/A';
  const firstDiscount = discountApplications[0]?.value;
  const discountValue = firstDiscount?.__typename === 'MoneyV2' ? firstDiscount : null;
  const discountPercentage = firstDiscount?.__typename === 'PricingPercentageValue' ? firstDiscount.percentage : null;

  return (
    <div>
      <Link href="/account/orders" className="font-sans text-sm underline hover:text-primary">
        &larr; Back to Orders
      </Link>
      <h2 className="mt-4 font-serif text-2xl text-on-surface">Order {order.name}</h2>
      <p className="mt-1 font-sans text-sm text-on-surface-variant">
        {new Date(order.processedAt).toLocaleDateString()} &middot; Confirmation #{order.confirmationNumber}
      </p>

      <table className="mt-8 w-full font-sans text-sm">
        <thead>
          <tr className="border-b border-surface-container-high text-left text-on-surface-variant">
            <th className="py-2 font-medium" colSpan={2}>
              Product
            </th>
            <th className="py-2 font-medium">Price</th>
            <th className="py-2 font-medium">Quantity</th>
            <th className="py-2 text-right font-medium">Discount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-container-high">
          {lineItems.map((item) => (
            <tr key={item.id}>
              <td className="w-24 py-4">
                {item.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.image.url} alt={item.image.altText ?? item.title} className="h-16 w-16 object-cover" />
                )}
              </td>
              <td className="py-4 text-on-surface">
                {item.title}
                {item.variantTitle && <span className="block text-on-surface-variant">{item.variantTitle}</span>}
              </td>
              <td className="py-4">{formatMoney(item.price)}</td>
              <td className="py-4">{item.quantity}</td>
              <td className="py-4 text-right">{formatMoney(item.totalDiscount)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          {(discountValue || discountPercentage != null) && (
            <tr>
              <td colSpan={4} className="pt-4 text-right text-on-surface-variant">
                Discount
              </td>
              <td className="pt-4 text-right">{discountValue ? formatMoney(discountValue) : `${discountPercentage}%`}</td>
            </tr>
          )}
          <tr>
            <td colSpan={4} className="pt-2 text-right text-on-surface-variant">
              Subtotal
            </td>
            <td className="pt-2 text-right">{formatMoney(order.subtotal)}</td>
          </tr>
          <tr>
            <td colSpan={4} className="pt-2 text-right text-on-surface-variant">
              Tax
            </td>
            <td className="pt-2 text-right">{formatMoney(order.totalTax)}</td>
          </tr>
          <tr>
            <td colSpan={4} className="pt-2 text-right font-semibold text-on-surface">
              Total
            </td>
            <td className="pt-2 text-right font-semibold text-on-surface">{formatMoney(order.totalPrice)}</td>
          </tr>
        </tfoot>
      </table>

      <div className="mt-10 grid grid-cols-1 gap-8 font-sans md:grid-cols-2">
        <div>
          <h3 className="text-xs font-semibold tracking-widest text-on-surface-variant uppercase">Shipping Address</h3>
          {order.shippingAddress ? (
            <p className="mt-2 text-sm text-on-surface">
              {order.shippingAddress.name}
              <br />
              {order.shippingAddress.formatted}
            </p>
          ) : (
            <p className="mt-2 text-sm text-on-surface-variant">No shipping address defined</p>
          )}
        </div>
        <div>
          <h3 className="text-xs font-semibold tracking-widest text-on-surface-variant uppercase">Status</h3>
          <p className="mt-2 text-sm text-on-surface">
            {order.fulfillmentStatus} &middot; {fulfillmentStatus}
          </p>
          <a
            href={order.statusPageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-sm font-semibold text-primary underline"
          >
            View Order Status &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
