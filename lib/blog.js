import 'server-only';
import { gql } from '@shopify/hydrogen';

import { getStorefrontClient } from '@/lib/storefront';

const BLOGS_LIST_QUERY = gql(`
  query Blogs($first: Int!) {
    blogs(first: $first) {
      nodes {
        id
        title
        handle
        seo {
          title
          description
        }
      }
    }
  }
`);

const BLOG_ARTICLES_QUERY = gql(`
  query Blog($blogHandle: String!, $first: Int!) {
    blog(handle: $blogHandle) {
      id
      title
      articles(first: $first, sortKey: PUBLISHED_AT, reverse: true) {
        nodes {
          id
          handle
          title
          publishedAt
          excerpt
          image {
            id
            url
            altText
          }
          author: authorV2 {
            name
          }
          blog {
            handle
          }
        }
      }
    }
  }
`);

const ARTICLE_QUERY = gql(`
  query Article($blogHandle: String!, $articleHandle: String!) {
    blog(handle: $blogHandle) {
      handle
      articleByHandle(handle: $articleHandle) {
        handle
        title
        contentHtml
        publishedAt
        author: authorV2 {
          name
        }
        image {
          id
          altText
          url
          width
          height
        }
        seo {
          title
          description
        }
      }
    }
  }
`);

export async function getBlogsList() {
  const storefrontClient = await getStorefrontClient();
  const { data } = await storefrontClient.graphql(BLOGS_LIST_QUERY, { variables: { first: 20 } });
  return data?.blogs?.nodes ?? [];
}

export async function getBlogArticles(blogHandle) {
  const storefrontClient = await getStorefrontClient();
  const { data } = await storefrontClient.graphql(BLOG_ARTICLES_QUERY, { variables: { blogHandle, first: 20 } });
  return data?.blog ?? null;
}

export async function getArticle(blogHandle, articleHandle) {
  const storefrontClient = await getStorefrontClient();
  const { data } = await storefrontClient.graphql(ARTICLE_QUERY, { variables: { blogHandle, articleHandle } });
  return data?.blog?.articleByHandle ?? null;
}
