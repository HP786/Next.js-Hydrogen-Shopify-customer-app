'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export function MobileMenu({ shopName, items }) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(() => new Set());

  function toggleExpanded(key) {
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

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
              <div className="absolute inset-y-0 left-0 flex w-4/5 max-w-xs flex-col gap-10 bg-canvas p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="font-serif text-xl tracking-tight text-primary">{shopName}</span>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close menu">
                <CloseIcon className="h-5 w-5 text-primary" />
              </button>
            </div>
            <nav className="flex flex-col gap-6 overflow-y-auto">
              {items.map((item) => (
                <div key={item.key}>
                  <div className="flex items-center justify-between gap-3">
                    {item.external ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setOpen(false)}
                        className="font-serif text-2xl text-on-surface hover:text-primary"
                      >
                        {item.title}
                      </a>
                    ) : (
                      <Link href={item.href} onClick={() => setOpen(false)} className="font-serif text-2xl text-on-surface hover:text-primary">
                        {item.title}
                      </Link>
                    )}
                    {item.children.length > 0 ? (
                      <button
                        type="button"
                        onClick={() => toggleExpanded(item.key)}
                        aria-label={expanded.has(item.key) ? `Collapse ${item.title}` : `Expand ${item.title}`}
                        className="p-1 text-on-surface-variant"
                      >
                        <ChevronDownIcon className={`h-5 w-5 transition-transform ${expanded.has(item.key) ? 'rotate-180' : ''}`} />
                      </button>
                    ) : null}
                  </div>

                  {item.children.length > 0 && expanded.has(item.key) ? (
                    <div className="mt-3 flex flex-col gap-3 border-l border-surface-container-high pl-4">
                      {item.children.map((child) =>
                        child.external ? (
                          <a
                            key={child.key}
                            href={child.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setOpen(false)}
                            className="font-sans text-sm font-semibold tracking-widest text-on-surface-variant uppercase hover:text-primary"
                          >
                            {child.title}
                          </a>
                        ) : (
                          <Link
                            key={child.key}
                            href={child.href}
                            onClick={() => setOpen(false)}
                            className="font-sans text-sm font-semibold tracking-widest text-on-surface-variant uppercase hover:text-primary"
                          >
                            {child.title}
                          </Link>
                        ),
                      )}
                    </div>
                  ) : null}
                </div>
              ))}
            </nav>
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

function ChevronDownIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
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
