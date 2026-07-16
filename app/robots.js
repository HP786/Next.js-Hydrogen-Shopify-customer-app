const siteUrl = process.env.SITE_URL || 'http://localhost:3000';

const generalDisallow = ['/cart', '/account', '/search'];

/** @returns {import('next').MetadataRoute.Robots} */
export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        disallow: generalDisallow,
      },
      {
        userAgent: 'adsbot-google',
        disallow: ['/cart', '/account'],
        allow: ['/search'],
      },
      {
        userAgent: 'Nutch',
        disallow: ['/'],
      },
      {
        userAgent: 'AhrefsBot',
        crawlDelay: 10,
        disallow: generalDisallow,
      },
      {
        userAgent: 'MJ12bot',
        crawlDelay: 10,
      },
      {
        userAgent: 'Pinterest',
        crawlDelay: 1,
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
