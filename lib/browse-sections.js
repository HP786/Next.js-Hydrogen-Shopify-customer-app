import 'server-only';
import { gql } from '@shopify/hydrogen';

import { getStorefrontClient } from '@/lib/storefront';

const REPRESENTATIVE_IMAGE_QUERY = gql(`
  query RepresentativeImage($handle: String!) {
    product(handle: $handle) {
      featuredImage {
        url
        altText
      }
    }
  }
`);

/**
 * For each {label, handle} entry (a color/category tile like "Blue" -> a real product
 * handle carrying that tag), fetches that product's real image so "shop by X" tiles
 * show actual inventory instead of generic stock photography.
 */
export async function getRepresentativeImages(options) {
  const storefrontClient = await getStorefrontClient();

  const entries = await Promise.all(
    options.map(async ({ label, handle }) => {
      const { data } = await storefrontClient.graphql(REPRESENTATIVE_IMAGE_QUERY, { variables: { handle } });
      return [label, data?.product?.featuredImage ?? null];
    }),
  );

  return Object.fromEntries(entries);
}
