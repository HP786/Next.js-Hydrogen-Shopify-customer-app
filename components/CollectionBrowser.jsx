'use client';

import { getFilterRemovalUrl, getSortByValue, isFilterInputActive, serializeCollectionParams } from '@shopify/hydrogen';
import { CollectionProvider, useCollection, useCollectionForm } from '@shopify/hydrogen/react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { AnalyticsEvent, getAnalytics, getAnalyticsShop } from '@/lib/analytics';
import { formatMoney } from '@/lib/money';

import { ProductCard } from './ProductCard';
import { TagFilterPicker } from './TagFilterPicker';

const COLLECTION_SORT_OPTIONS = [
  { label: 'Featured', value: getSortByValue('COLLECTION_DEFAULT', false) },
  { label: 'Best selling', value: getSortByValue('BEST_SELLING', false) },
  { label: 'Alphabetically, A-Z', value: getSortByValue('TITLE', false) },
  { label: 'Alphabetically, Z-A', value: getSortByValue('TITLE', true) },
  { label: 'Price, low to high', value: getSortByValue('PRICE', false) },
  { label: 'Price, high to low', value: getSortByValue('PRICE', true) },
];

const SEARCH_SORT_OPTIONS = [
  { label: 'Relevance', value: getSortByValue('RELEVANCE', false) },
  { label: 'Price, low to high', value: getSortByValue('PRICE', false) },
  { label: 'Price, high to low', value: getSortByValue('PRICE', true) },
];

const PRICE_FIELD_MIN = 'filter.v.price.gte';
const PRICE_FIELD_MAX = 'filter.v.price.lte';

export function CollectionBrowser(props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlSearch = searchParams.toString();
  const handle = props.mode === 'collection' ? props.handle : props.mode === 'search' ? `search:${props.term}` : 'catalog:all';

  return (
    <CollectionProvider
      data={{ handle, dataSearch: props.dataSearch }}
      urlSearch={urlSearch}
      onChange={(search) => {
        const href = `${pathname}${search}`;
        if (urlSearch) {
          router.replace(href, { scroll: false });
        } else {
          router.push(href, { scroll: false });
        }
        router.refresh();
      }}
    >
      <BrowserContent {...props} />
    </CollectionProvider>
  );
}

function BrowserContent(props) {
  const state = useCollection();
  const { formProps } = useCollectionForm();
  const pathname = usePathname();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const isSearchLike = props.mode === 'search' || props.mode === 'catalog';
  const currentSortValue = isSearchLike
    ? state.sortKey === 'PRICE'
      ? getSortByValue('PRICE', state.reverse)
      : getSortByValue('RELEVANCE', false)
    : state.sortKey
      ? getSortByValue(state.sortKey, state.reverse)
      : getSortByValue('COLLECTION_DEFAULT', false);
  const hasActiveFilters = state.filters.length > 0;
  const isLoading = state.status === 'loading';

  useEffect(() => {
    const bus = getAnalytics();
    if (!bus || isLoading) return;
    const payload = { url: window.location.href, shop: getAnalyticsShop() };
    if (props.mode === 'search') {
      bus.publish(AnalyticsEvent.SEARCH_VIEWED, { ...payload, searchTerm: props.term, searchResults: props.products.length });
    } else if (props.mode === 'collection') {
      bus.publish(AnalyticsEvent.COLLECTION_VIEWED, { ...payload, collection: { id: props.handle, handle: props.handle } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fire once results settle for this view
  }, [props.mode, props.term, isLoading, props.products.length]);

  const clearPath = props.mode === 'search' ? buildSearchUrl(pathname, props.term) : pathname;
  const formKey =
    props.mode === 'search'
      ? `${props.term}|${serializeCollectionParams(state).toString()}`
      : serializeCollectionParams(state).toString();

  return (
    <main className="mx-auto max-w-[1320px] px-6 py-6 md:px-16 md:py-8">
      {props.mode === 'search' ? (
        <SearchHeader term={props.term} totalCount={props.totalCount} />
      ) : props.mode === 'catalog' ? (
        <CollectionHeader title="All Rugs" description={null} count={props.totalCount} />
      ) : (
        <CollectionHeader title={props.title} description={props.description} count={props.products.length} />
      )}

      {props.mode === 'search' ? <SearchForm term={props.term} /> : null}

      {props.mode === 'search' && !props.term ? (
        <p className="mt-12 font-sans text-lg text-on-surface-variant">Enter a search term to find products.</p>
      ) : (
        <form {...formProps()} key={formKey} method="get" action={pathname} className="mt-6">
          {props.mode === 'search' ? <input type="hidden" name="q" value={props.term} /> : null}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-b border-surface-container-high py-3.5">
            <div className="flex flex-wrap items-center gap-2.5">
              {props.availableFilters.length > 0 ? (
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(true)}
                  className="flex items-center gap-2 border border-outline px-3.5 py-2.5 font-sans text-[13px] text-on-surface md:hidden"
                >
                  <FilterIcon className="h-4 w-4" />
                  Filters
                  {hasActiveFilters ? <span className="ml-1 h-1.5 w-1.5 rounded-full bg-secondary" /> : null}
                </button>
              ) : null}
              <DesktopFilterBar availableFilters={props.availableFilters} activeFilters={state.filters} disabled={isLoading} />
              <span role="status" aria-live="polite" aria-atomic="true" className="font-sans text-xs text-on-surface-variant/60">
                {isLoading ? 'Updating…' : ''}
              </span>
            </div>

            <SortSelect
              options={isSearchLike ? SEARCH_SORT_OPTIONS : COLLECTION_SORT_OPTIONS}
              currentValue={currentSortValue}
              disabled={isLoading}
            />
          </div>

          {hasActiveFilters ? (
            <ActiveFilterChips clearPath={clearPath} filters={state.filters} currentParams={serializeCollectionParams(state)} />
          ) : null}

          <div className="mt-6">
            <section
              className={`grid grid-cols-2 gap-x-3.5 gap-y-8 transition-opacity duration-200 sm:grid-cols-3 lg:grid-cols-4 ${isLoading ? 'opacity-50' : 'opacity-100'}`}
            >
              {props.products.map((product, index) => (
                <ProductCard key={product.id ?? `${product.handle}-${index}`} product={product} />
              ))}
            </section>

            {props.products.length === 0 && !isLoading ? (
              <EmptyResults mode={props.mode} term={props.mode === 'search' ? props.term : undefined} clearPath={clearPath} hasActiveFilters={hasActiveFilters} />
            ) : null}
          </div>

          {props.availableFilters.length > 0 && mobileFiltersOpen ? (
            <MobileFilterSheet
              availableFilters={props.availableFilters}
              activeFilters={state.filters}
              disabled={isLoading}
              onClose={() => setMobileFiltersOpen(false)}
            />
          ) : null}
        </form>
      )}
    </main>
  );
}

function SortSelect({ options, currentValue, disabled }) {
  return (
    <div className="relative">
      <select
        name="sort_by"
        defaultValue={currentValue}
        disabled={disabled}
        onChange={requestFormSubmit}
        className="appearance-none border border-outline bg-surface-container-lowest py-2.5 pr-9 pl-3.5 font-sans text-[13px] text-on-surface disabled:cursor-not-allowed disabled:opacity-50"
      >
        {options.map((option) => (
          <option key={option.label} value={option.value}>
            Sort: {option.label}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3 h-2.5 w-2.5 -translate-y-1/2 text-on-surface-variant" />
    </div>
  );
}

function DesktopFilterBar({ availableFilters, activeFilters, disabled }) {
  return (
    <div className="hidden flex-wrap items-center gap-2.5 md:flex">
      <FilterDropdown label="Style, Room &amp; Colour" count={0}>
        <TagFilterPicker selected={[]} />
      </FilterDropdown>
      {availableFilters.map((filter) => (
        <FilterDropdown key={filter.id} label={filter.label} count={countActiveForFilter(filter, activeFilters)}>
          {filter.type === 'PRICE_RANGE' ? (
            <PriceRangeFilter filter={filter} activeFilters={activeFilters} disabled={disabled} />
          ) : (
            <FilterGroup filter={filter} activeFilters={activeFilters} disabled={disabled} />
          )}
        </FilterDropdown>
      ))}
    </div>
  );
}

function FilterDropdown({ label, count, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-2 border border-outline px-3.5 py-2.5 font-sans text-[13px] text-on-surface ${
          open || count > 0 ? 'bg-surface-dim' : 'bg-surface-container-lowest'
        }`}
      >
        {label}
        {count > 0 ? (
          <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-secondary px-1 text-[10.5px] text-on-secondary">{count}</span>
        ) : null}
        <ChevronDownIcon className="h-2.5 w-2.5 text-on-surface-variant" />
      </button>
      {open ? (
        <>
          <button type="button" aria-label="Close" tabIndex={-1} onClick={() => setOpen(false)} className="fixed inset-0 z-10 cursor-default" />
          <div className="absolute top-[calc(100%+6px)] left-0 z-20 max-h-[248px] w-[230px] overflow-y-auto border border-surface-container-high bg-surface p-1.5 shadow-[0_14px_34px_rgba(30,25,18,0.14)]">
            {children}
          </div>
        </>
      ) : null}
    </div>
  );
}

function countActiveForFilter(filter, activeFilters) {
  if (filter.type === 'PRICE_RANGE') return activeFilters.some((f) => f.price) ? 1 : 0;
  return filter.values.filter((value) => isFilterInputActive(activeFilters, value.input)).length;
}

function requestFormSubmit(event) {
  event.currentTarget.form?.requestSubmit();
}

function uncheckSiblings(checkbox) {
  const form = checkbox.form;
  if (!form) return;

  for (const sibling of form.elements) {
    if (sibling instanceof HTMLInputElement && sibling !== checkbox && sibling.name === checkbox.name && sibling.type === 'checkbox') {
      sibling.checked = false;
    }
  }
}

function SearchForm({ term }) {
  const pathname = usePathname();

  return (
    <form method="get" action={pathname} className="mt-8 flex max-w-xl gap-0">
      <input
        type="search"
        name="q"
        defaultValue={term}
        placeholder="Search products"
        className="min-w-0 flex-1 border border-outline-variant bg-surface-container-low px-4 py-3 font-sans text-base focus:border-primary focus:outline-none"
      />
      <button type="submit" className="bg-primary px-6 py-3 font-sans text-sm font-semibold tracking-widest text-canvas uppercase hover:opacity-90">
        Search
      </button>
    </form>
  );
}

function CollectionHeader({ title, description, count }) {
  return (
    <header className="max-w-2xl">
      <h1 className="font-serif text-4xl leading-tight text-on-surface md:text-6xl">{title}</h1>
      {description ? <p className="mt-6 font-sans text-base leading-relaxed text-on-surface-variant md:text-lg">{description}</p> : null}
      <p className="mt-3 font-sans text-sm text-on-surface-variant/70">
        {count} {count === 1 ? 'product' : 'products'}
      </p>
    </header>
  );
}

function SearchHeader({ term, totalCount }) {
  return (
    <header className="max-w-2xl">
      <h1 className="font-serif text-4xl leading-tight text-on-surface md:text-6xl">Search</h1>
      {term ? <p className="mt-6 font-sans text-base leading-relaxed text-on-surface-variant md:text-lg">Results for &quot;{term}&quot;</p> : null}
      <p className="mt-3 font-sans text-sm text-on-surface-variant/70">
        {totalCount} {totalCount === 1 ? 'product' : 'products'}
      </p>
    </header>
  );
}

function ActiveFilterChips({ clearPath, filters, currentParams }) {
  return (
    <div className="flex flex-wrap items-center gap-2.5 pt-4 pb-1">
      {filters.map((filter) => {
        const serialized = JSON.stringify(filter);
        const removalSearch = getFilterRemovalUrl(currentParams, filter);
        const href = removalSearch === '?' ? clearPath : `${clearPath}${removalSearch}`;

        return (
          <Link
            key={serialized}
            href={href}
            className="inline-flex items-center gap-1.5 rounded-full border border-surface-variant bg-surface-dim py-1.5 pr-2 pl-3 font-sans text-[12.5px] text-on-surface"
          >
            {describeFilter(filter)}
            <CloseIcon className="h-[15px] w-[15px] text-on-surface-variant" aria-hidden="true" />
          </Link>
        );
      })}
      <Link href={clearPath} className="ml-1 font-sans text-[12.5px] text-secondary underline underline-offset-2">
        Clear all filters
      </Link>
    </div>
  );
}

function MobileFilterSheet({ availableFilters, activeFilters, disabled, onClose }) {
  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <button type="button" aria-label="Close filters" onClick={onClose} className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-y-0 left-0 flex w-[85%] max-w-sm flex-col overflow-y-auto bg-canvas p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-serif text-xl text-on-surface">Filters</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="p-1">
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>
        <FilterList availableFilters={availableFilters} activeFilters={activeFilters} disabled={disabled} />
        {/* Price/Availability apply live as they change; this just dismisses the sheet.
            Style/Room/Colour have their own "See Results" button above (TagFilterPicker),
            since those navigate to a different page instead of applying in place. */}
        <button
          type="button"
          onClick={onClose}
          className="mt-8 w-full border border-outline-variant px-4 py-3 font-sans text-xs font-semibold tracking-widest text-on-surface uppercase transition hover:border-primary hover:text-primary"
        >
          Close
        </button>
      </div>
    </div>
  );
}

function FilterList({ availableFilters, activeFilters, disabled }) {
  return (
    <div>
      <p className="mb-1 font-sans text-sm font-semibold tracking-wide text-on-surface uppercase">Filter:</p>
      <div className="border-t border-outline-variant/40">
        <AccordionSection title="Style, Room &amp; Colour" defaultOpen>
          <TagFilterPicker selected={[]} />
        </AccordionSection>
        {availableFilters.map((filter) => (
          <AccordionSection key={filter.id} title={filter.label}>
            {filter.type === 'PRICE_RANGE' ? (
              <PriceRangeFilter filter={filter} activeFilters={activeFilters} disabled={disabled} />
            ) : (
              <FilterGroup filter={filter} activeFilters={activeFilters} disabled={disabled} />
            )}
          </AccordionSection>
        ))}
      </div>
    </div>
  );
}

function AccordionSection({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-outline-variant/40">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between py-4 font-sans text-sm text-on-surface"
      >
        {title}
        <ChevronDownIcon className={`h-4 w-4 text-on-surface-variant transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open ? <div className="pb-4">{children}</div> : null}
    </div>
  );
}

function PriceRangeFilter({ filter, activeFilters, disabled }) {
  const bounds = parsePriceInput(filter.values[0]?.input);
  const activePrice = activeFilters.find((f) => f.price)?.price;

  return (
    <fieldset disabled={disabled} className={disabled ? 'opacity-60' : undefined}>
      <div className="flex items-center gap-3">
        <label className="flex-1">
          <span className="sr-only">Minimum price</span>
          <input
            type="number"
            name={PRICE_FIELD_MIN}
            min={bounds?.min}
            max={bounds?.max}
            defaultValue={activePrice?.min ?? ''}
            placeholder={bounds ? `$${Math.round(bounds.min)}` : 'Min'}
            onBlur={requestFormSubmit}
            className="w-full border border-outline-variant bg-surface-container-low px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
        </label>
        <span className="text-on-surface-variant">&ndash;</span>
        <label className="flex-1">
          <span className="sr-only">Maximum price</span>
          <input
            type="number"
            name={PRICE_FIELD_MAX}
            min={bounds?.min}
            max={bounds?.max}
            defaultValue={activePrice?.max ?? ''}
            placeholder={bounds ? `$${Math.round(bounds.max)}` : 'Max'}
            onBlur={requestFormSubmit}
            className="w-full border border-outline-variant bg-surface-container-low px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
        </label>
      </div>
    </fieldset>
  );
}

function FilterGroup({ filter, activeFilters, disabled }) {
  const visibleValues = filter.values.filter((value) => value.count > 0);
  if (visibleValues.length === 0) return null;

  const availabilityParamName = 'filter.v.availability';
  const isMutuallyExclusive =
    filter.type === 'BOOLEAN' ||
    filter.values.some((v) => {
      const entries = filterInputParamEntries(v.input);
      return entries.length === 1 && entries[0].name === availabilityParamName;
    });

  const isColor = filter.presentation === 'SWATCH' || /colou?r/i.test(filter.label);
  const isSize = /size/i.test(filter.label);

  if (isColor) {
    return (
      <fieldset disabled={disabled} className={disabled ? 'opacity-60' : undefined}>
        <div className="flex flex-wrap gap-3">
          {visibleValues.map((value) => {
            const entries = filterInputParamEntries(value.input);
            if (entries.length !== 1) return null;
            const [{ name, value: paramValue }] = entries;
            const isActive = isFilterInputActive(activeFilters, value.input);

            return (
              <label key={value.id} title={value.label} className="cursor-pointer">
                <input
                  type="checkbox"
                  name={name}
                  value={paramValue}
                  defaultChecked={isActive}
                  onChange={(e) => {
                    if (isMutuallyExclusive && e.currentTarget.checked) uncheckSiblings(e.currentTarget);
                    requestFormSubmit(e);
                  }}
                  className="peer sr-only"
                />
                <span
                  style={{ background: value.swatch?.color ?? '#ccc' }}
                  className="block h-8 w-8 rounded-full border border-outline-variant peer-checked:ring-2 peer-checked:ring-primary peer-checked:ring-offset-2"
                />
              </label>
            );
          })}
        </div>
      </fieldset>
    );
  }

  if (isSize) {
    return (
      <fieldset disabled={disabled} className={disabled ? 'opacity-60' : undefined}>
        <div className="grid grid-cols-2 gap-2">
          {visibleValues.map((value) => {
            const entries = filterInputParamEntries(value.input);
            if (entries.length !== 1) return null;
            const [{ name, value: paramValue }] = entries;
            const isActive = isFilterInputActive(activeFilters, value.input);

            return (
              <label key={value.id} className="cursor-pointer">
                <input
                  type="checkbox"
                  name={name}
                  value={paramValue}
                  defaultChecked={isActive}
                  onChange={(e) => {
                    if (isMutuallyExclusive && e.currentTarget.checked) uncheckSiblings(e.currentTarget);
                    requestFormSubmit(e);
                  }}
                  className="peer sr-only"
                />
                <span
                  className={`block border px-2 py-2.5 text-center font-sans text-xs font-semibold peer-disabled:cursor-not-allowed ${
                    isActive ? 'border-primary bg-secondary-container text-primary' : 'border-outline-variant text-on-surface hover:border-primary'
                  }`}
                >
                  {value.label}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>
    );
  }

  return (
    <fieldset disabled={disabled} className={disabled ? 'opacity-60' : undefined}>
      <div className="space-y-2">
        {visibleValues.map((value) => {
          const entries = filterInputParamEntries(value.input);
          if (entries.length !== 1) return null;

          const [{ name, value: paramValue }] = entries;
          const isActive = isFilterInputActive(activeFilters, value.input);

          return (
            <label key={value.id} className="flex cursor-pointer items-center gap-2 font-sans text-sm">
              <input
                type="checkbox"
                name={name}
                value={paramValue}
                defaultChecked={isActive}
                onChange={(e) => {
                  if (isMutuallyExclusive && e.currentTarget.checked) uncheckSiblings(e.currentTarget);
                  requestFormSubmit(e);
                }}
                className="h-4 w-4 border-outline-variant accent-primary disabled:cursor-not-allowed"
              />
              <span className={isActive ? 'font-semibold text-on-surface' : 'text-on-surface-variant'}>{value.label}</span>
              <span className="ml-auto text-xs text-on-surface-variant/50">({value.count})</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function EmptyResults({ mode, term, clearPath, hasActiveFilters }) {
  return (
    <div className="mt-16 text-center">
      <p className="font-sans text-lg text-on-surface-variant">
        {mode === 'search' ? `No products found for "${term ?? ''}".` : 'No products found matching your filters.'}
      </p>
      {hasActiveFilters ? (
        <Link href={clearPath} className="mt-4 inline-block font-sans text-sm font-semibold text-tertiary underline">
          Clear all filters
        </Link>
      ) : null}
    </div>
  );
}

function filterInputParamEntries(input) {
  let filter;
  try {
    filter = JSON.parse(input);
  } catch {
    return [];
  }

  return Array.from(serializeCollectionParams({ filters: [filter], sortKey: undefined, reverse: false }), ([name, value]) => ({ name, value }));
}

function parsePriceInput(input) {
  if (!input) return null;
  try {
    const parsed = JSON.parse(input);
    if (parsed?.price) return parsed.price;
  } catch {
    return null;
  }
  return null;
}

function describeFilter(filter) {
  if (filter.tag) return filter.tag;
  if (filter.productType) return filter.productType;
  if (filter.productVendor) return filter.productVendor;
  if (filter.available != null) return filter.available ? 'In stock' : 'Out of stock';
  if (filter.variantOption) return `${filter.variantOption.name}: ${filter.variantOption.value}`;
  if (filter.price) {
    const { min, max } = filter.price;
    const currencyCode = 'USD';
    const minMoney = min != null ? { amount: String(min), currencyCode } : null;
    const maxMoney = max != null ? { amount: String(max), currencyCode } : null;

    if (minMoney && !maxMoney) return `${formatMoney(minMoney)}+`;
    if (maxMoney && !minMoney) return `Up to ${formatMoney(maxMoney)}`;
    if (minMoney && maxMoney) return `${formatMoney(minMoney)} - ${formatMoney(maxMoney)}`;
  }
  return 'Filter';
}

function buildSearchUrl(pathname, term) {
  const params = new URLSearchParams();
  params.set('q', term);
  return `${pathname}?${params.toString()}`;
}

function FilterIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" {...props}>
      <path d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round" />
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
