// Shopify Inbox's widget (see components/ChatWidget.jsx) needs these domains
// allow-listed to load its script, talk to the messaging backend, and render
// its captcha challenge — required because the widget is hand-embedded here
// (theme app extensions, which would normally allow-list this automatically,
// only attach to Liquid themes, not this app).
// 'unsafe-inline' on script-src is broader than ideal, but this app has no
// nonce-based CSP plumbing set up, and Next.js's App Router relies on some
// inline bootstrap scripts for hydration — a stricter policy here risks
// breaking the whole site's interactivity, not just the chat widget.
// Widened to wildcards on Shopify's own infrastructure domains after the first
// deploy: the real widget (verified via live browser console) calls more
// *.shopifyapps.com / *.shopifysvc.com endpoints — telemetry, error reporting,
// captcha session state — than the specific subdomains found by research
// alone, and also loads an external stylesheet from cdn.shopify.com, not just
// inline styles.
const CHAT_CSP_DIRECTIVES = [
  "script-src 'self' 'unsafe-inline' cdn.shopify.com",
  "style-src 'self' 'unsafe-inline' cdn.shopify.com",
  "connect-src 'self' *.shopifyapps.com *.shopifysvc.com wss://*.pusher.com *.pusher.com",
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
