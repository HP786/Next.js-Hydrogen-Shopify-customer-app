import { createCartServerHandlers } from '@shopify/hydrogen';

import { CART_FRAGMENT } from '@/lib/cart-fragment';

export const cartHandlers = createCartServerHandlers({ fragment: CART_FRAGMENT });
