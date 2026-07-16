'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { COLLECTION_OPTIONS, COLOR_OPTIONS, ROOM_OPTIONS, tagPageHref } from '@/lib/shop-taxonomy';

const GROUPS = [
  { title: 'Style', options: COLLECTION_OPTIONS },
  { title: 'Room', options: ROOM_OPTIONS },
  { title: 'Colour', options: COLOR_OPTIONS },
];

/**
 * Lets a shopper check any number of Style/Room/Colour tags before committing —
 * nothing navigates until "See Results" is pressed, so picking several filters at
 * once works instead of each click jumping straight to a single-tag page.
 */
export function TagFilterPicker({ selected }) {
  const router = useRouter();
  const [pending, setPending] = useState(() => new Set(selected));

  function toggle(tag) {
    setPending((current) => {
      const next = new Set(current);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  }

  function seeResults() {
    const tags = [...pending];
    router.push(tags.length > 0 ? tagPageHref(tags) : '/collections/all');
  }

  return (
    <div className="space-y-8">
      {GROUPS.map((group) => (
        <div key={group.title}>
          <p className="font-sans text-sm font-semibold text-on-surface">{group.title}</p>
          {group.title === 'Colour' ? (
            <div className="mt-3 flex flex-wrap gap-3">
              {group.options.map((option) => {
                const isChecked = pending.has(option.tag);
                return (
                  <label key={option.tag} title={option.label} className="cursor-pointer">
                    <input type="checkbox" checked={isChecked} onChange={() => toggle(option.tag)} className="peer sr-only" />
                    <span
                      className="block h-8 w-8 rounded-full border border-outline-variant/40 peer-checked:ring-2 peer-checked:ring-primary peer-checked:ring-offset-2 peer-checked:ring-offset-canvas"
                      style={{ background: option.swatch }}
                    />
                  </label>
                );
              })}
            </div>
          ) : (
            <div className="mt-3 flex flex-wrap gap-2">
              {group.options.map((option) => {
                const isChecked = pending.has(option.tag);
                return (
                  <label key={option.tag} className="cursor-pointer">
                    <input type="checkbox" checked={isChecked} onChange={() => toggle(option.tag)} className="peer sr-only" />
                    <span
                      className={`block border px-3 py-1.5 font-sans text-xs transition ${
                        isChecked ? 'border-primary bg-secondary-container text-primary' : 'border-outline-variant text-on-surface hover:border-primary'
                      }`}
                    >
                      {option.label}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      ))}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={seeResults}
          className="flex-1 bg-primary px-4 py-3 font-sans text-xs font-semibold tracking-widest text-on-primary uppercase transition-opacity hover:opacity-90"
        >
          See Results
        </button>
        {pending.size > 0 ? (
          <button
            type="button"
            onClick={() => setPending(new Set())}
            className="border border-outline-variant px-4 py-3 font-sans text-xs font-semibold tracking-widest text-on-surface uppercase transition hover:border-primary hover:text-primary"
          >
            Clear
          </button>
        ) : null}
      </div>
    </div>
  );
}
