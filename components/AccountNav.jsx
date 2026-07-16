'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/account/orders', label: 'Orders' },
  { href: '/account/profile', label: 'Profile' },
  { href: '/account/addresses', label: 'Addresses' },
];

export function AccountNav() {
  const pathname = usePathname();

  return (
    <nav className="mt-6 flex flex-wrap items-center gap-6 border-b border-surface-container-high pb-4 font-sans text-xs font-semibold tracking-widest uppercase">
      {LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={pathname.startsWith(link.href) ? 'border-b border-primary pb-1 text-primary' : 'text-on-surface-variant hover:text-primary'}
        >
          {link.label}
        </Link>
      ))}
      <form action="/account/logout" method="POST" className="ml-auto">
        <button type="submit" className="text-on-surface-variant hover:text-primary">
          Logout
        </button>
      </form>
    </nav>
  );
}
