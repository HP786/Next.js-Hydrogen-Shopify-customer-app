'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function TradeApplyForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const params = email ? `?email=${encodeURIComponent(email)}` : '';
    router.push(`/trade/registration${params}`);
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex max-w-2xl flex-col gap-4 md:flex-row">
      <input
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Professional email address"
        className="flex-grow border-0 border-b border-outline bg-transparent px-0 py-4 font-sans text-base text-on-surface transition-colors focus:border-secondary focus:ring-0 focus:outline-none"
      />
      <button
        type="submit"
        className="bg-primary px-10 py-4 font-sans text-[13px] tracking-[0.13em] whitespace-nowrap text-on-primary uppercase transition-colors hover:bg-charcoal-muted"
      >
        Start your application
      </button>
    </form>
  );
}
