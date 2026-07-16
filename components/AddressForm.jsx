'use client';

import { useActionState } from 'react';

import { deleteAddressAction } from '@/lib/customer-account/actions';

const emptyAddress = {
  firstName: '',
  lastName: '',
  company: '',
  address1: '',
  address2: '',
  city: '',
  zoneCode: '',
  zip: '',
  territoryCode: '',
  phoneNumber: '',
};

export function AddressForm({ address, isDefault, saveAction, submitLabel, pendingLabel, showDelete }) {
  const [state, formAction, isPending] = useActionState(saveAction, { error: null });
  const [deleteState, deleteAction, isDeleting] = useActionState(deleteAddressAction, { error: null });
  const fields = { ...emptyAddress, ...address };
  const addressId = address?.id ?? 'NEW_ADDRESS_ID';

  return (
    <div className="border border-surface-container-high bg-surface-container-low p-6 font-sans">
      <form action={formAction} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <input type="hidden" name="addressId" value={addressId} />
        <Field label="First name" name="firstName" defaultValue={fields.firstName} required autoComplete="given-name" />
        <Field label="Last name" name="lastName" defaultValue={fields.lastName} required autoComplete="family-name" />
        <Field label="Company" name="company" defaultValue={fields.company} className="sm:col-span-2" />
        <Field label="Address" name="address1" defaultValue={fields.address1} required className="sm:col-span-2" />
        <Field label="Apartment, suite, etc." name="address2" defaultValue={fields.address2} className="sm:col-span-2" />
        <Field label="City" name="city" defaultValue={fields.city} required />
        <Field label="State / Province" name="zoneCode" defaultValue={fields.zoneCode} required />
        <Field label="Zip / Postal Code" name="zip" defaultValue={fields.zip} required />
        <Field label="Country Code" name="territoryCode" defaultValue={fields.territoryCode} required maxLength={2} />
        <Field
          label="Phone"
          name="phoneNumber"
          defaultValue={fields.phoneNumber}
          type="tel"
          pattern="^\+?[1-9]\d{3,14}$"
          className="sm:col-span-2"
        />

        <label className="flex items-center gap-2 text-sm text-on-surface sm:col-span-2">
          <input type="checkbox" name="defaultAddress" defaultChecked={isDefault} className="h-4 w-4 accent-primary" />
          Set as default address
        </label>

        {state.error && <p className="text-sm text-red-600 sm:col-span-2">{state.error}</p>}

        <button
          type="submit"
          disabled={isPending}
          className="mt-2 w-fit bg-primary px-5 py-3 text-xs font-semibold tracking-widest text-on-primary uppercase disabled:opacity-50 sm:col-span-2"
        >
          {isPending ? pendingLabel : submitLabel}
        </button>
      </form>

      {showDelete && (
        <form action={deleteAction} className="mt-4">
          <input type="hidden" name="addressId" value={addressId} />
          {deleteState.error && <p className="text-sm text-red-600">{deleteState.error}</p>}
          <button type="submit" disabled={isDeleting} className="text-sm text-red-600 underline disabled:opacity-50">
            {isDeleting ? 'Deleting' : 'Delete'}
          </button>
        </form>
      )}
    </div>
  );
}

function Field({ label, name, defaultValue, required, type = 'text', className = '', ...rest }) {
  return (
    <label className={`flex flex-col gap-2 text-xs font-semibold tracking-widest text-on-surface-variant uppercase ${className}`}>
      {label}
      {required ? ' *' : ''}
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        required={required}
        className="border-0 border-b border-outline-variant bg-transparent py-2 text-base font-normal normal-case text-on-surface focus:border-primary focus:outline-none"
        {...rest}
      />
    </label>
  );
}
