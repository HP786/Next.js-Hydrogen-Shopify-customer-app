import 'server-only';
import { cache } from 'react';

import { FOOTER_QUERY } from '@/lib/fragments';
import { getStorefrontClient } from '@/lib/storefront';

const FOOTER_MENU_HANDLE = 'footer';

export const getFooterData = cache(async () => {
  const storefrontClient = await getStorefrontClient();
  const { data } = await storefrontClient
    .graphql(FOOTER_QUERY, {
      variables: { footerMenuHandle: FOOTER_MENU_HANDLE },
    })
    .catch((error) => {
      console.error(error);
      return { data: null };
    });
  return data;
});
