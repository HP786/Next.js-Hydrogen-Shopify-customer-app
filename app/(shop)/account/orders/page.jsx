import Link from 'next/link';

import { OrderSearchForm } from '@/components/OrderSearchForm';
import { queryCustomerAccount } from '@/lib/customer-account/client';
import { buildOrderSearchQuery, parseOrderFilters } from '@/lib/order-filters';
import { CUSTOMER_ORDERS_QUERY } from '@/lib/customer-account/queries';
import { formatMoney } from '@/lib/money';

export const metadata = {
  title: 'Orders',
};

export const dynamic = 'force-dynamic';

export default async function OrdersPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const urlSearchParams = new URLSearchParams(
    Object.entries(resolvedSearchParams ?? {}).flatMap(([key, value]) =>
      value == null ? [] : [[key, Array.isArray(value) ? value[0] : value]],
    ),
  );
  const filters = parseOrderFilters(urlSearchParams);
  const query = buildOrderSearchQuery(filters);

  const data = await queryCustomerAccount(CUSTOMER_ORDERS_QUERY, { first: 20, query });
  const orders = data?.customer?.orders?.nodes ?? [];
  const hasFilters = Boolean(filters.name || filters.confirmationNumber);

  return (
    <div>
      <OrderSearchForm />

      {orders.length === 0 ? (
        <div className="mt-10 font-sans text-sm text-on-surface-variant">
          {hasFilters ? (
            <>
              No orders found matching your search.{' '}
              <Link href="/account/orders" className="underline hover:text-primary">
                Clear filters &rarr;
              </Link>
            </>
          ) : (
            <>
              You haven&rsquo;t placed any orders yet.{' '}
              <Link href="/collections" className="underline hover:text-primary">
                Start Shopping &rarr;
              </Link>
            </>
          )}
        </div>
      ) : (
        <ul className="mt-10 divide-y divide-surface-container-high border-y border-surface-container-high font-sans">
          {orders.map((order) => (
            <li key={order.id}>
              <Link href={`/account/orders/${btoa(order.id)}`} className="flex items-center justify-between py-4 hover:opacity-70">
                <span>
                  <span className="font-medium text-on-surface">Order {order.number}</span>
                  <span className="ml-3 text-sm text-on-surface-variant">{new Date(order.processedAt).toLocaleDateString()}</span>
                </span>
                <span className="flex items-center gap-3 text-sm">
                  <span className="text-on-surface-variant">{order.fulfillments?.nodes?.[0]?.status ?? 'N/A'}</span>
                  <span className="font-semibold text-on-surface">{formatMoney(order.totalPrice)}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
