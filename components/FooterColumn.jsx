'use client';

import { useState } from 'react';

/** Collapsed accordion on mobile; always-open flat column on desktop (md:flex overrides the hidden state). */
export function FooterColumn({ title, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className="mb-3.5 flex w-full items-center justify-between gap-2 text-left font-sans text-xs tracking-[0.12em] text-inverse-on-surface uppercase md:pointer-events-none md:cursor-default"
      >
        {title}
        <ChevronIcon className={`h-3.5 w-3.5 shrink-0 transition-transform md:hidden ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`${open ? 'flex' : 'hidden'} flex-col gap-2.5 pb-1 font-sans text-[13.5px] md:flex md:pb-0`}>{children}</div>
    </div>
  );
}

function ChevronIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
