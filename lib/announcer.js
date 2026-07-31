'use client';
import { createContext, useContext, useCallback, useRef, useState } from 'react';

const AnnouncerContext = createContext(null);

/**
 * A single polite live region for the whole storefront (WCAG 4.1.3).
 *
 * Adding to the cart, placing an order, changing filters and saving a profile
 * all used to update silently — the change was visible but nothing reached a
 * screen reader. Any component can now call `announce('Added to cart')`.
 *
 * The region is always in the DOM (assistive tech only watches live regions it
 * observed at load), and the message is cleared shortly afterwards so the same
 * text announced twice in a row still registers as a change.
 */
export function AnnouncerProvider({ children }) {
  const [message, setMessage] = useState('');
  const timerRef = useRef(null);

  const announce = useCallback((text) => {
    if (!text) return;
    clearTimeout(timerRef.current);
    // Clear first so a repeat of the same string still counts as a mutation
    setMessage('');
    timerRef.current = setTimeout(() => {
      setMessage(text);
      timerRef.current = setTimeout(() => setMessage(''), 4000);
    }, 60);
  }, []);

  return (
    <AnnouncerContext.Provider value={{ announce }}>
      {children}
      <div className="visually-hidden" role="status" aria-live="polite" aria-atomic="true">
        {message}
      </div>
    </AnnouncerContext.Provider>
  );
}

export function useAnnouncer() {
  const context = useContext(AnnouncerContext);
  // Deliberately tolerant: a component rendered outside the provider should
  // not crash the storefront just because it wanted to announce something.
  return context || { announce: () => {} };
}
