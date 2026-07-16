import { AddressForm } from '@/components/AddressForm';
import { getCustomerDetails } from '@/lib/customer-account/client';
import { createAddressAction, updateAddressAction } from '@/lib/customer-account/actions';

export const metadata = {
  title: 'Addresses',
};

export const dynamic = 'force-dynamic';

export default async function AddressesPage() {
  const customer = await getCustomerDetails();
  const addresses = customer?.addresses?.nodes ?? [];
  const defaultAddressId = customer?.defaultAddress?.id;

  return (
    <div className="space-y-10 font-sans">
      <section>
        <h2 className="text-xs font-semibold tracking-widest text-on-surface-variant uppercase">New address</h2>
        <div className="mt-4">
          <AddressForm key={addresses.length} saveAction={createAddressAction} submitLabel="Create" pendingLabel="Creating" />
        </div>
      </section>

      <section>
        <h2 className="text-xs font-semibold tracking-widest text-on-surface-variant uppercase">Saved addresses</h2>
        {addresses.length === 0 ? (
          <p className="mt-4 text-sm text-on-surface-variant">You have no addresses saved.</p>
        ) : (
          <div className="mt-4 space-y-4">
            {addresses.map((address) => (
              <AddressForm
                key={address.id}
                address={address}
                isDefault={address.id === defaultAddressId}
                saveAction={updateAddressAction}
                submitLabel="Save"
                pendingLabel="Saving"
                showDelete
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
