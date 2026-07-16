import 'server-only';
import { gql } from '@shopify/hydrogen';

// The trade-discount Shopify Function only fires for carts carrying this
// attribute (see admin-api/extensions/trade-discount) — it's how the discount
// stays scoped to this storefront and can never apply through the retail
// Online Store, even for a genuinely trade_approved customer shopping there.
export const SALES_CHANNEL_ATTRIBUTE = { key: 'sales_channel', value: 'trade_storefront' };

const CART_ATTRIBUTES_UPDATE_MUTATION = gql(`
  mutation CartAttributesUpdate($cartId: ID!, $attributes: [AttributeInput!]!) {
    cartAttributesUpdate(cartId: $cartId, attributes: $attributes) {
      userErrors {
        field
        message
      }
    }
  }
`);

/** @param {{id: string, attributes?: {key: string, value: string}[]} | null | undefined} cart */
export async function ensureSalesChannelAttribute(cart, storefrontClient) {
  if (!cart?.id) return;

  const current = cart.attributes?.find((attribute) => attribute.key === SALES_CHANNEL_ATTRIBUTE.key)?.value;
  if (current === SALES_CHANNEL_ATTRIBUTE.value) return;

  await storefrontClient.graphql(CART_ATTRIBUTES_UPDATE_MUTATION, {
    variables: { cartId: cart.id, attributes: [SALES_CHANNEL_ATTRIBUTE] },
  });
}
