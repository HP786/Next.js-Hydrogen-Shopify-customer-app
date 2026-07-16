'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const ANCHOR_LINKS = [
  { key: 'benefits', title: 'Benefits', href: '/#trade-benefits' },
  { key: 'who', title: "Who it's for", href: '/#trade-who' },
  { key: 'how', title: 'How it works', href: '/#trade-how' },
  { key: 'faq', title: 'FAQ', href: '/#trade-faq' },
];

export function TradeMobileMenu({ loggedIn, hasRegistered }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} aria-label="Open menu" className="p-1 text-primary md:hidden">
        <MenuIcon className="h-6 w-6" />
      </button>

      {open
        ? createPortal(
            <div className="fixed inset-0 z-50 md:hidden">
              <button type="button" aria-label="Close menu" onClick={() => setOpen(false)} className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-y-0 left-0 flex w-4/5 max-w-xs flex-col gap-8 bg-canvas p-6 shadow-2xl">
                <div className="flex items-center justify-between">
                  <span className="font-sans text-lg font-semibold tracking-tight text-primary">Trade Program</span>
                  <button type="button" onClick={() => setOpen(false)} aria-label="Close menu">
                    <CloseIcon className="h-5 w-5 text-primary" />
                  </button>
                </div>
                <nav className="flex flex-col gap-5">
                  {ANCHOR_LINKS.map((item) => (
                    <Link
                      key={item.key}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="font-sans text-lg text-on-surface hover:text-secondary"
                    >
                      {item.title}
                    </Link>
                  ))}
                </nav>
                <div className="mt-auto flex flex-col gap-3">
                  {loggedIn ? (
                    <Link
                      href="/account"
                      onClick={() => setOpen(false)}
                      className="rounded-md bg-primary px-5 py-3 text-center font-sans text-xs tracking-[0.1em] text-on-primary uppercase transition hover:bg-charcoal-muted"
                    >
                      My account
                    </Link>
                  ) : (
                    <a
                      href="/account/login"
                      onClick={() => setOpen(false)}
                      className="rounded-md border border-primary px-5 py-3 text-center font-sans text-xs tracking-[0.1em] text-on-surface uppercase transition hover:bg-surface-container-low"
                    >
                      Log in
                    </a>
                  )}
                  {hasRegistered && !loggedIn ? (
                    <Link
                      href="/shop"
                      onClick={() => setOpen(false)}
                      className="rounded-md bg-primary px-5 py-3 text-center font-sans text-xs tracking-[0.1em] text-on-primary uppercase transition hover:bg-charcoal-muted"
                    >
                      Browse rugs
                    </Link>
                  ) : (
                    <Link
                      href="/trade/registration"
                      onClick={() => setOpen(false)}
                      className="rounded-md bg-primary px-5 py-3 text-center font-sans text-xs tracking-[0.1em] text-on-primary uppercase transition hover:bg-charcoal-muted"
                    >
                      Apply for trade
                    </Link>
                  )}
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

function MenuIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
    </svg>
  );
}
