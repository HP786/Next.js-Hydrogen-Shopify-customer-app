import { createStorefrontClient, gql } from '@shopify/hydrogen';

import { filterVisibleToCustomer } from '@/lib/access-control';
import { storefrontConfig } from '@/lib/config';

const siteUrl = (process.env.SITE_URL || 'http://localhost:3000').replace(/\/+$/, '');

const SITEMAP_QUERY = gql(`
  query Sitemap {
    products(first: 250) {
      nodes {
        handle
        tags
        updatedAt
      }
    }
    collections(first: 250) {
      nodes {
        handle
        updatedAt
      }
    }
    pages(first: 250) {
      nodes {
        handle
        updatedAt
      }
    }
    blogs(first: 20) {
      nodes {
        handle
        articles(first: 100) {
          nodes {
            handle
            publishedAt
            blog {
              handle
            }
          }
        }
      }
    }
  }
`);

/** @returns {Promise<import('next').MetadataRoute.Sitemap>} */
export default async function sitemap() {
  const storefrontClient = createStorefrontClient({
    type: 'private_shared_rate_limit',
    config: {
      storeDomain: storefrontConfig.storeDomain,
      i18n: storefrontConfig.i18n,
      privateStorefrontToken: process.env.PRIVATE_STOREFRONT_API_TOKEN,
    },
  });

  const { data } = await storefrontClient.graphql(SITEMAP_QUERY);

  const entries = [
    { url: siteUrl, changeFrequency: 'daily', priority: 1 },
    { url: `${siteUrl}/collections`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${siteUrl}/blogs`, changeFrequency: 'weekly', priority: 0.5 },
  ];

  for (const product of filterVisibleToCustomer(data?.products?.nodes ?? [])) {
    entries.push({ url: `${siteUrl}/products/${product.handle}`, lastModified: product.updatedAt, changeFrequency: 'daily', priority: 0.7 });
  }

  for (const collection of data?.collections?.nodes ?? []) {
    entries.push({ url: `${siteUrl}/collections/${collection.handle}`, lastModified: collection.updatedAt, changeFrequency: 'daily', priority: 0.6 });
  }

  for (const page of data?.pages?.nodes ?? []) {
    entries.push({ url: `${siteUrl}/pages/${page.handle}`, lastModified: page.updatedAt, changeFrequency: 'monthly', priority: 0.4 });
  }

  for (const blog of data?.blogs?.nodes ?? []) {
    for (const article of blog.articles.nodes) {
      entries.push({
        url: `${siteUrl}/blogs/${article.blog.handle}/${article.handle}`,
        lastModified: article.publishedAt,
        changeFrequency: 'monthly',
        priority: 0.4,
      });
    }
  }

  return entries;
}
