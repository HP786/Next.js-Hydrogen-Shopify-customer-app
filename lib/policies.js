import 'server-only';
import { gql } from '@shopify/hydrogen';

import { getStorefrontClient } from '@/lib/storefront';

const POLICY_HANDLES = {
  'privacy-policy': 'privacyPolicy',
  'shipping-policy': 'shippingPolicy',
  'terms-of-service': 'termsOfService',
  'refund-policy': 'refundPolicy',
  'subscription-policy': 'subscriptionPolicy',
};

const POLICIES_QUERY = gql(`
  fragment PolicyItem on ShopPolicy {
    id
    title
    handle
  }
  query Policies {
    shop {
      privacyPolicy {
        ...PolicyItem
      }
      shippingPolicy {
        ...PolicyItem
      }
      termsOfService {
        ...PolicyItem
      }
      refundPolicy {
        ...PolicyItem
      }
      subscriptionPolicy {
        id
        title
        handle
      }
    }
  }
`);

const POLICY_CONTENT_QUERY = gql(`
  fragment Policy on ShopPolicy {
    body
    handle
    id
    title
    url
  }
  query Policy(
    $privacyPolicy: Boolean!
    $shippingPolicy: Boolean!
    $termsOfService: Boolean!
    $refundPolicy: Boolean!
    $subscriptionPolicy: Boolean!
  ) {
    shop {
      privacyPolicy @include(if: $privacyPolicy) {
        ...Policy
      }
      shippingPolicy @include(if: $shippingPolicy) {
        ...Policy
      }
      termsOfService @include(if: $termsOfService) {
        ...Policy
      }
      refundPolicy @include(if: $refundPolicy) {
        ...Policy
      }
      subscriptionPolicy @include(if: $subscriptionPolicy) {
        ...Policy
      }
    }
  }
`);

export async function getPolicies() {
  const storefrontClient = await getStorefrontClient();
  const { data } = await storefrontClient.graphql(POLICIES_QUERY);
  const shop = data?.shop ?? {};
  return [shop.privacyPolicy, shop.shippingPolicy, shop.termsOfService, shop.refundPolicy, shop.subscriptionPolicy].filter(
    (policy) => policy != null,
  );
}

export async function getPolicy(handle) {
  const policyKey = POLICY_HANDLES[handle];
  if (!policyKey) return null;

  const storefrontClient = await getStorefrontClient();
  const { data } = await storefrontClient.graphql(POLICY_CONTENT_QUERY, {
    variables: {
      privacyPolicy: policyKey === 'privacyPolicy',
      shippingPolicy: policyKey === 'shippingPolicy',
      termsOfService: policyKey === 'termsOfService',
      refundPolicy: policyKey === 'refundPolicy',
      subscriptionPolicy: policyKey === 'subscriptionPolicy',
    },
  });

  return data?.shop?.[policyKey] ?? null;
}
