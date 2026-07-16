/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  // Lets the dev server's hot-reload client connect when the site is viewed through
  // a tunnel (e.g. a trycloudflare.com quick tunnel) instead of localhost directly.
  allowedDevOrigins: ['*.trycloudflare.com'],
};

module.exports = nextConfig;
