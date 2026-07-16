'use client';

import { useState } from 'react';

export function ChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed right-5 bottom-5 z-[61]">
      {open ? (
        <div className="absolute right-0 bottom-16 w-[min(300px,calc(100vw-40px))] border border-surface-container-high bg-surface shadow-[0_16px_44px_rgba(30,25,18,0.22)]">
          <div className="flex items-center justify-between bg-tertiary px-4 py-3.5 text-on-tertiary">
            <span className="font-sans text-[13.5px] font-semibold">Chat with us</span>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close chat" className="text-lg leading-none">
              &times;
            </button>
          </div>
          <div className="p-[18px] font-sans text-[13.5px] leading-relaxed text-on-surface-variant">
            Hi there 👋 Questions about sizing or delivery? We usually reply within a few minutes.
          </div>
        </div>
      ) : null}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Open chat"
        className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-secondary text-white shadow-[0_8px_24px_rgba(138,75,58,0.4)] transition hover:bg-charcoal-muted"
      >
        <ChatIcon />
      </button>
    </div>
  );
}

function ChatIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6">
      <path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4.2A8 8 0 1 1 20 12z" />
    </svg>
  );
}
