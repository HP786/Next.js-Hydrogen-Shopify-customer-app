'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const WishlistContext = createContext(null);
const STORAGE_KEY = 'hh_wish';

/** LocalStorage-backed wishlist of product IDs, mirrored across tabs via the storage event. */
export function WishlistProvider({ children }) {
  const [ids, setIds] = useState([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      if (Array.isArray(stored)) setIds(stored);
    } catch {
      // ignore malformed storage
    }

    function onStorage(event) {
      if (event.key !== STORAGE_KEY) return;
      try {
        setIds(Array.isArray(JSON.parse(event.newValue ?? '[]')) ? JSON.parse(event.newValue ?? '[]') : []);
      } catch {
        // ignore malformed storage
      }
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const toggle = useCallback((id) => {
    setIds((current) => {
      const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // storage may be unavailable (private browsing) — state still updates for this tab
      }
      return next;
    });
  }, []);

  const value = useMemo(() => ({ ids, has: (id) => ids.includes(id), toggle, count: ids.length }), [ids, toggle]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
