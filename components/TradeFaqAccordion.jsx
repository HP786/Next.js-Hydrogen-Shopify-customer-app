'use client';

import { useState } from 'react';

const FAQS = [
  {
    question: 'Is there a minimum order to hold a trade account?',
    answer: 'No. There is no minimum spend to register or to keep your account active. Order as your projects require.',
  },
  {
    question: 'How much is the trade discount?',
    answer: 'Discounts vary by collection and are confirmed once your application is verified, typically 15–25% below retail.',
  },
  {
    question: 'Can I get samples before ordering?',
    answer: 'Yes. Trade accounts can request swatch sets of any material (NZ wool, jute or viscose) free of charge.',
  },
  {
    question: 'How long does approval take?',
    answer: 'Most applications are reviewed within one business day. You will be emailed once your account is active.',
  },
  {
    question: 'Do you offer net payment terms?',
    answer: 'Net 30 terms are available for established firms and retailers after your first two orders.',
  },
];

export function TradeFaqAccordion() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div>
      {FAQS.map((faq, index) => {
        const open = openIndex === index;
        return (
          <div key={faq.question} className="border-b border-surface-container-high">
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : index)}
              aria-expanded={open}
              className="flex w-full items-center justify-between gap-4 py-[18px] text-left"
            >
              <span className="font-sans text-[15px] font-semibold text-on-surface">{faq.question}</span>
              <span className="shrink-0 font-sans text-xl text-secondary">{open ? '−' : '+'}</span>
            </button>
            {open ? <p className="mb-5 max-w-xl font-sans text-sm leading-relaxed text-on-surface-variant">{faq.answer}</p> : null}
          </div>
        );
      })}
    </div>
  );
}
