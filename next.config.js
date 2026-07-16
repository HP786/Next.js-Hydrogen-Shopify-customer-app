// Shopify Inbox's widget (see components/ChatWidget.jsx) needs these domains
// allow-listed to load its script, talk to the messaging backend, and render
// its captcha challenge — required because the widget is hand-embedded here
// (theme app extensions, which would normally allow-list this automatically,
// only attach to Liquid themes, not this app).
// 'unsafe-inline' on script-src is broader than ideal, but this app has no
// nonce-based CSP plumbing set up, and Next.js's App Router relies on some
// inline bootstrap scripts for hydration — a stricter policy here risks
// breaking the whole site's interactivity, not just the chat widget.
const CHAT_CSP_DIRECTIVES = [
  "script-src 'self' 'unsafe-inline' cdn.shopify.com",
  "style-src 'self' 'unsafe-inline'",
  "connect-src 'self' shopify-chat.shopifyapps.com messaging-api.shopifyapps.com monorail-edge.shopifysvc.com https://otlp-http-production.shopifysvc.com wss://ws-us2.pusher.com pusher.com *.pusher.com",
  'frame-src *.hcaptcha.com',
  'child-src *.hcaptcha.com',
].join('; ');

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  // Lets the dev server's hot-reload client connect when the site is viewed through
  // a tunnel (e.g. a trycloudflare.com quick tunnel) instead of localhost directly.
  allowedDevOrigins: ['*.trycloudflare.com'],
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [{ key: 'Content-Security-Policy', value: CHAT_CSP_DIRECTIVES }],
      },
    ];
  },
};

module.exports = nextConfig;
