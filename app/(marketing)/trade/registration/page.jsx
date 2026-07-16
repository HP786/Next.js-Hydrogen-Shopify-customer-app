'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { STOCK_IMAGES } from '@/lib/stock-images';

const initialState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  role: '',
  street: '',
  suburb: '',
  state: '',
  postCode: '',
  country: 'Australia',
  companyName: '',
  abn: '',
  website: '',
  socialMedia: '',
  businessType: '',
  itemsPerYear: '',
  minOrderQuantity: '',
  portfolio: '',
  annualSpend: '',
};

export default function TradeRegistration() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState(() => ({ ...initialState, email: searchParams.get('email') ?? '' }));
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus('submitting');
    setError(null);

    try {
      const response = await fetch('/api/trade-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Something went wrong. Please try again.');
      }

      setStatus('success');
    } catch (submitError) {
      setStatus('error');
      setError(submitError.message);
    }
  }

  if (status === 'success') {
    return (
      <main className="relative flex min-h-[calc(100vh-58px)] items-center justify-center overflow-hidden p-6 sm:p-[60px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={STOCK_IMAGES.heroLivingSpace} alt="Haus & Harbour styled interior" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,14,11,0.5),rgba(16,14,11,0.55))]" />
        <div className="relative w-full max-w-[480px] rounded-[10px] bg-canvas px-6 py-10 text-center shadow-[0_30px_70px_rgba(0,0,0,0.4)] sm:px-11 sm:py-[60px]">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#8a4b3a" strokeWidth="1.3" className="mx-auto mb-[22px]">
            <circle cx="12" cy="12" r="10" />
            <path d="M7.5 12.5l3 3 6-6" />
          </svg>
          <h1 className="mb-3 font-sans text-[28px] font-semibold text-on-surface">You&rsquo;re registered</h1>
          <p className="mb-[30px] font-sans text-[14.5px] leading-relaxed text-on-surface-variant">
            Our trade team reviews every application by hand and will email you within one business day to confirm your pricing
            access. In the meantime, feel free to start browsing the full catalogue.
          </p>
          <Link
            href="/shop"
            className="inline-block rounded-md bg-primary px-[26px] py-3.5 font-sans text-[13px] tracking-[0.13em] text-on-primary uppercase transition hover:bg-charcoal-muted"
          >
            Start Browsing Rugs
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-canvas text-on-surface">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="relative hidden min-h-[600px] lg:block">
          <div className="sticky top-0 h-screen w-full overflow-hidden bg-surface-container-high">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={STOCK_IMAGES.bohoHomeOfficeDesk} alt="Haus & Harbour styled for the trade" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/75 via-primary/5 to-transparent" />
            <div className="absolute bottom-16 left-10 max-w-sm space-y-3">
              <h2 className="font-display text-[32px] leading-[1.12] font-normal text-on-primary italic sm:text-[38px]">Defined by curated design.</h2>
              <p className="font-sans text-sm text-on-primary/90">Join a community of elite designers and architects shaping the future of Australian homes.</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-16 md:px-16 md:py-24">
          <div className="max-w-xl">
            <span className="mb-3 block font-sans text-xs tracking-[0.2em] text-secondary uppercase">Trade &amp; Commercial</span>
            <h1 className="font-sans text-[30px] font-semibold text-on-surface sm:text-5xl">Register your business</h1>
            <p className="mt-6 font-sans text-base text-on-surface-variant">
              Tell us about your studio or firm. The email you enter below is what you&rsquo;ll use to sign in once your application
              is approved.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-12 max-w-xl space-y-8">
            <FormSection step="01" title="Business Contact">
              <Field label="First name" name="firstName" value={formData.firstName} onChange={handleChange} required />
              <Field label="Last name" name="lastName" value={formData.lastName} onChange={handleChange} required />
              <Field label="Email address" name="email" type="email" value={formData.email} onChange={handleChange} required />
              <Field label="Phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
              <Field label="Professional role" name="role" value={formData.role} onChange={handleChange} className="sm:col-span-2" />
            </FormSection>

            <FormSection step="02" title="Business Address">
              <Field label="Street address" name="street" value={formData.street} onChange={handleChange} className="sm:col-span-2" />
              <Field label="Suburb / city" name="suburb" value={formData.suburb} onChange={handleChange} />
              <Field label="State / territory" name="state" value={formData.state} onChange={handleChange} />
              <Field label="Postcode" name="postCode" value={formData.postCode} onChange={handleChange} />
              <Field label="Country" name="country" value={formData.country} onChange={handleChange} />
            </FormSection>

            <FormSection step="03" title="Company Details">
              <Field label="Company name" name="companyName" value={formData.companyName} onChange={handleChange} required />
              <Field label="ABN / Tax ID" name="abn" value={formData.abn} onChange={handleChange} />
              <Field label="Website URL" name="website" type="url" value={formData.website} onChange={handleChange} />
              <Field label="Social media handle" name="socialMedia" value={formData.socialMedia} onChange={handleChange} />
              <Field label="Business type" name="businessType" placeholder="Interior designer, architect…" value={formData.businessType} onChange={handleChange} />
              <Field label="Projects per year" name="itemsPerYear" value={formData.itemsPerYear} onChange={handleChange} />
              <Field
                label="Minimum quantity per order"
                name="minOrderQuantity"
                type="number"
                value={formData.minOrderQuantity}
                onChange={handleChange}
                placeholder="e.g. 10"
                required
              />
              <Field label="Portfolio link" name="portfolio" value={formData.portfolio} onChange={handleChange} />
              <Field label="Estimated annual spend" name="annualSpend" value={formData.annualSpend} onChange={handleChange} />
            </FormSection>

            {error && <p className="font-sans text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full bg-primary px-8 py-[18px] font-sans text-[13px] tracking-[0.13em] text-on-primary uppercase transition hover:bg-charcoal-muted disabled:opacity-50"
            >
              {status === 'submitting' ? 'Submitting…' : 'Submit Application'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

function FormSection({ step, title, children }) {
  return (
    <div className="space-y-6 border-t border-surface-container-highest pt-8 first:border-t-0 first:pt-0">
      <div className="flex items-center gap-3">
        <span className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-[#d9c48e] font-sans text-[11.5px] font-bold text-[#4a3c1c]">{step}</span>
        <span className="font-sans text-[21px] font-semibold text-on-surface">{title}</span>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function Field({ label, name, value, onChange, type = 'text', required = false, placeholder, className = '' }) {
  return (
    <label className={`flex flex-col gap-2 font-sans text-[11px] tracking-[0.1em] text-secondary uppercase ${className}`}>
      {label}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full border-0 border-b border-outline bg-transparent py-2 font-sans text-[15px] font-normal text-on-surface normal-case outline-none transition focus:border-secondary"
      />
    </label>
  );
}
