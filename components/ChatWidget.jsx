'use client';

import Script from 'next/script';

// Shopify Inbox's real embed, extracted directly from the store's own Liquid
// theme (app block `shopify://apps/inbox/blocks/chat/...`) — this app has no
// theme to render that embed into automatically (theme app extensions only
// attach to Online Store 2.0 themes), so the same config + loader script is
// reproduced here by hand.
const CHAT_SETTINGS = {
  greetingMessage: '',
  showFeaturedProducts: true,
  featuredProducts: [],
  horizontalPosition: 'bottom_right',
  icon: 'chat_bubble',
  buttonLabel: 'Chat',
};

export function ChatWidget({ storeDomain }) {
  if (!storeDomain) return null;

  return (
    <>
      <script
        id="shopify-chat-app-embed-data"
        type="application/json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({ settings: CHAT_SETTINGS }) }}
      />
      <script
        id="shopify-agent-app-embed-data"
        type="application/json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({ settings: CHAT_SETTINGS }) }}
      />
      <style
        dangerouslySetInnerHTML={{
          __html: `
            :root {
              --shopify-chat-bg-color: #FFFFFF;
              --shopify-agent-bg-color: #FFFFFF;
              --shopify-chat-text-color: #000000;
              --shopify-agent-text-color: #000000;
              --shopify-chat-accent-bg-color: #000000;
              --shopify-agent-accent-bg-color: #000000;
              --shopify-chat-accent-text-color: #FFFFFF;
              --shopify-agent-accent-text-color: #FFFFFF;
              --shopify-chat-activator-offset: 20px;
              --shopify-agent-activator-offset: 20px;
              --shopify-chat-border-radius: 16px;
              --shopify-agent-border-radius: 16px;
            }
          `,
        }}
      />
      <Script
        id="shopify-chat-bundle-selector"
        src="https://cdn.shopify.com/extensions/019f6767-7823-7ae4-9b2c-804746d32ed3/shopify-inbox-1289/assets/shopify-chat-bundle-selector.js"
        strategy="lazyOnload"
        data-chat-src="https://cdn.shopify.com/storefront/web-components/agent.js"
        data-agent-src="https://cdn.shopify.com/storefront/web-components/agent.js"
        data-legacy-src="https://cdn.shopify.com/extensions/019f6767-7823-7ae4-9b2c-804746d32ed3/shopify-inbox-1289/assets/inbox-chat-loader.js"
        data-horizontal-position="bottom_right"
        data-vertical-position="lowest"
        data-icon="chat_bubble"
        data-text="chat_with_us"
        data-color="#000000"
        data-secondary-color="#FFFFFF"
        data-ternary-color="#6A6A6A"
        data-domain={storeDomain}
        data-shop-domain={storeDomain}
        data-external-identifier="agHt9pFfc3-sdZayfVynvhmsY4I0GoShRhYgUnRNmOI"
      />
      <shopify-chat mode="standalone" mode-switch="" />
    </>
  );
}
