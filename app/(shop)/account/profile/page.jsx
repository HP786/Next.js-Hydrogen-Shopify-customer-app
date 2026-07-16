import { ProfileForm } from '@/components/ProfileForm';
import { getCustomerDetails } from '@/lib/customer-account/client';

export const metadata = {
  title: 'Profile',
};

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const customer = await getCustomerDetails();
  return <ProfileForm customer={customer} />;
}
