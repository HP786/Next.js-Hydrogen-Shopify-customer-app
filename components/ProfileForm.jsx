'use client';

import { useActionState } from 'react';

import { updateProfileAction } from '@/lib/customer-account/actions';

export function ProfileForm({ customer }) {
  const [state, formAction, isPending] = useActionState(updateProfileAction, { error: null, customer: null });
  const current = state.customer ?? customer;

  return (
    <form action={formAction} className="max-w-md space-y-5 font-sans">
      <label className="flex flex-col gap-2 text-xs font-semibold tracking-widest text-on-surface-variant uppercase">
        First name
        <input
          type="text"
          name="firstName"
          defaultValue={current?.firstName ?? ''}
          minLength={2}
          autoComplete="given-name"
          className="border-0 border-b border-outline-variant bg-transparent py-2 text-base font-normal normal-case text-on-surface focus:border-primary focus:outline-none"
        />
      </label>
      <label className="flex flex-col gap-2 text-xs font-semibold tracking-widest text-on-surface-variant uppercase">
        Last name
        <input
          type="text"
          name="lastName"
          defaultValue={current?.lastName ?? ''}
          minLength={2}
          autoComplete="family-name"
          className="border-0 border-b border-outline-variant bg-transparent py-2 text-base font-normal normal-case text-on-surface focus:border-primary focus:outline-none"
        />
      </label>
      {state.error && <mark className="block bg-transparent text-sm text-red-600">{state.error}</mark>}
      <button
        type="submit"
        disabled={isPending}
        className="bg-primary px-5 py-3 text-xs font-semibold tracking-widest text-on-primary uppercase disabled:opacity-50"
      >
        {isPending ? 'Updating' : 'Update'}
      </button>
    </form>
  );
}
