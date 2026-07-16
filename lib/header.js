import 'server-only';
import { cache } from 'react';

import { HEADER_QUERY } from '@/lib/fragments';
import { getStorefrontClient } from '@/lib/storefront';

const HEADER_MENU_HANDLE = 'main-menu';

export const getHeaderData = cache(async () => {
  const storefrontClient = await getStorefrontClient();
  const { data } = await storefrontClient.graphql(HEADER_QUERY, {
    variables: { headerMenuHandle: HEADER_MENU_HANDLE },
  });
  return data;
});
