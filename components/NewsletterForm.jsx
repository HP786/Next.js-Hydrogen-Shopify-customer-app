'use client';

import { useState } from 'react';

export function NewsletterForm({ variant = 'light' }) {
  const [status, setStatus] = useState('idle');
  const dark = variant === 'dark';

  function handleSubmit(event) {
    event.preventDefault();
    setStatus('subscribed');
  }

  if (status === 'subscribed') {
    return <p className={`mt-4 text-sm font-medium ${dark ? 'text-inverse-on-surface' : 'text-on-surface'}`}>Thanks, you&rsquo;re on the list.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className={dark ? 'flex max-w-md gap-3' : 'flex max-w-md gap-0'}>
      <label className="sr-only" htmlFor="newsletter-email">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        placeholder="Email Address"
        className={
          dark
            ? 'min-w-0 flex-1 border border-inverse-on-surface/25 bg-transparent px-4 py-2.5 text-sm text-inverse-on-surface placeholder:text-inverse-on-surface/50 focus:border-inverse-on-surface focus:outline-none'
            : 'min-w-0 flex-1 border-0 border-b border-on-surface-variant/40 bg-transparent px-0 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary focus:outline-none'
        }
      />
      <button
        type="submit"
        className={
          dark
            ? 'shrink-0 rounded-md bg-inverse-on-surface px-5 py-2.5 text-xs font-semibold tracking-widest text-primary uppercase transition-opacity hover:opacity-90'
            : 'shrink-0 bg-primary px-5 py-2.5 text-xs font-semibold tracking-widest text-on-primary uppercase transition-opacity hover:opacity-90'
        }
      >
        {dark ? 'Subscribe' : 'Sign Up'}
      </button>
    </form>
  );
}
