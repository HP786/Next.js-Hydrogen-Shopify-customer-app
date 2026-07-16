import { cookies } from 'next/headers';

const ADMIN_API_VERSION = '2026-07';
const TRADE_REGISTERED_COOKIE = 'trade_registered';

/** @param {Request} request */
export async function POST(request) {
  /** @type {Record<string, string>} */
  const data = await request.json();

  if (!data.email || !data.companyName) {
    return Response.json({ success: false, error: 'Email and company name are required.' }, { status: 400 });
  }

  const minOrderQuantity = Number(data.minOrderQuantity);
  if (!Number.isInteger(minOrderQuantity) || minOrderQuantity <= 0) {
    return Response.json({ success: false, error: 'Minimum quantity per order must be a positive whole number.' }, { status: 400 });
  }

  const SHOPIFY_STORE = process.env.SHOPIFY_STORE;
  const SHOPIFY_CLIENT_ID = process.env.SHOPIFY_CLIENT_ID;
  const SHOPIFY_CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET;

  try {
    const accessToken = await getAdminAccessToken({
      store: SHOPIFY_STORE,
      clientId: SHOPIFY_CLIENT_ID,
      clientSecret: SHOPIFY_CLIENT_SECRET,
    });

    const response = await fetch(`https://${SHOPIFY_STORE}/admin/api/${ADMIN_API_VERSION}/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken,
      },
      body: JSON.stringify({
        query: CUSTOMER_CREATE_MUTATION,
        variables: {
          input: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone || undefined,
            tags: ['trade_pending'],
            note: buildCustomerNote(data),
            metafields: [
              {
                namespace: 'custom',
                key: 'min_order_quantity',
                type: 'number_integer',
                value: String(minOrderQuantity),
              },
            ],
          },
        },
      }),
    });

    const result = await response.json();
    const userErrors = result?.data?.customerCreate?.userErrors;

    if (!response.ok || (userErrors && userErrors.length > 0)) {
      const message = userErrors?.[0]?.message || 'Failed to create customer.';
      return Response.json({ success: false, error: message }, { status: 400 });
    }

    const store = await cookies();
    store.set(TRADE_REGISTERED_COOKIE, '1', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('Trade application error:', error);
    return Response.json({ success: false, error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}

async function getAdminAccessToken({ store, clientId, clientSecret }) {
  const response = await fetch(`https://${store}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'client_credentials',
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to authenticate with Shopify Admin API.');
  }

  const { access_token: accessToken } = await response.json();
  return accessToken;
}

function buildCustomerNote(data) {
  const address = [data.street, data.suburb, data.state, data.postCode, data.country].filter(Boolean).join(', ');

  return [
    `ABN: ${data.abn || '-'}`,
    `Company: ${data.companyName || '-'}`,
    `Website: ${data.website || '-'}`,
    `Social media: ${data.socialMedia || '-'}`,
    `Business type: ${data.businessType || '-'}`,
    `Items per year: ${data.itemsPerYear || '-'}`,
    `Minimum quantity per order: ${data.minOrderQuantity || '-'}`,
    `Portfolio: ${data.portfolio || '-'}`,
    `Estimated annual spend: ${data.annualSpend || '-'}`,
    `Role: ${data.role || '-'}`,
    `Address: ${address || '-'}`,
  ].join('\n');
}

const CUSTOMER_CREATE_MUTATION = `#graphql
  mutation CustomerCreate($input: CustomerInput!) {
    customerCreate(input: $input) {
      customer {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;
