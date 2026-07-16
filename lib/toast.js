'use client';

import { createContext, useCallback, useContext, useRef, useState } from 'react';

const ToastContext = createContext(null);

/** Global "X added to cart"-style toast, fired from anywhere via useToast(). */
export function ToastProvider({ children }) {
  const [message, setMessage] = useState('');
  const timeoutRef = useRef(null);

  const showToast = useCallback((text) => {
    clearTimeout(timeoutRef.current);
    setMessage(text);
    timeoutRef.current = setTimeout(() => setMessage(''), 2200);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {message ? (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-[26px] left-1/2 z-[70] -translate-x-1/2 animate-[hh-fade_0.3s_ease_both] bg-primary px-6 py-3.5 font-sans text-[13.5px] tracking-wide text-on-primary shadow-[0_10px_30px_rgba(0,0,0,0.28)]"
        >
          {message}
        </div>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
