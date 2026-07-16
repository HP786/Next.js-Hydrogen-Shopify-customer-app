'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useRef, useState } from 'react';

import { ORDER_FILTER_FIELDS } from '@/lib/order-filters';

export function OrderSearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const formRef = useRef(null);
  const [isSearching, setIsSearching] = useState(false);

  const hasFilters = searchParams.get(ORDER_FILTER_FIELDS.NAME) || searchParams.get(ORDER_FILTER_FIELDS.CONFIRMATION_NUMBER);

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const params = new URLSearchParams();

    for (const field of Object.values(ORDER_FILTER_FIELDS)) {
      const value = String(formData.get(field) ?? '').trim();
      if (value) params.set(field, value);
    }

    setIsSearching(true);
    router.push(`/account/orders${params.toString() ? `?${params.toString()}` : ''}`);
    setTimeout(() => setIsSearching(false), 300);
  }

  function handleClear() {
    formRef.current?.reset();
    router.push('/account/orders');
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-wrap items-end gap-4 font-sans">
      <label className="flex flex-col gap-2 text-xs font-semibold tracking-widest text-on-surface-variant uppercase">
        Order number
        <input
          type="search"
          name={ORDER_FILTER_FIELDS.NAME}
          defaultValue={searchParams.get(ORDER_FILTER_FIELDS.NAME) ?? ''}
          placeholder="#1001"
          className="border-0 border-b border-outline-variant bg-transparent py-2 text-sm font-normal normal-case text-on-surface focus:border-primary focus:outline-none"
        />
      </label>
      <label className="flex flex-col gap-2 text-xs font-semibold tracking-widest text-on-surface-variant uppercase">
        Confirmation number
        <input
          type="search"
          name={ORDER_FILTER_FIELDS.CONFIRMATION_NUMBER}
          defaultValue={searchParams.get(ORDER_FILTER_FIELDS.CONFIRMATION_NUMBER) ?? ''}
          placeholder="ABC123"
          className="border-0 border-b border-outline-variant bg-transparent py-2 text-sm font-normal normal-case text-on-surface focus:border-primary focus:outline-none"
        />
      </label>
      <button
        type="submit"
        disabled={isSearching}
        className="bg-primary px-4 py-2.5 text-xs font-semibold tracking-widest text-on-primary uppercase disabled:opacity-50"
      >
        {isSearching ? 'Searching' : 'Search'}
      </button>
      {hasFilters && (
        <button type="button" onClick={handleClear} className="text-sm text-on-surface-variant underline hover:text-primary">
          Clear
        </button>
      )}
    </form>
  );
}
