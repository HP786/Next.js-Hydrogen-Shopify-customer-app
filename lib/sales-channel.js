import 'server-only';
import { gql } from '@shopify/hydrogen';

// The trade site stamps its carts with sales_channel=trade_storefront so the
// trade-discount Shopify Function (admin-api/extensions/trade-discount) can
// scope itself to that storefront only. This site stamps the retail
// equivalent — no discount currently reads it, but it keeps cart origin
// unambiguous in Shopify Admin and leaves the door open for a retail-only
// promotion later without another wiring change.
export const SALES_CHANNEL_ATTRIBUTE = { key: 'sales_channel', value: 'retail_storefront' };

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
