'use client';
import { createContext, useContext, useState } from 'react';

const PageContext = createContext(null);

/**
 * Holds lightweight context about what the shopper is currently looking at, so
 * surfaces rendered outside the page tree (e.g. the floating ChatFAB) can act on
 * it. Today this is the active product on a PDP — used so the chat assistant can
 * resolve references like "this item".
 */
export function PageContextProvider({ children }) {
  const [activeProduct, setActiveProduct] = useState(null);

  return (
    <PageContext.Provider value={{ activeProduct, setActiveProduct }}>
      {children}
    </PageContext.Provider>
  );
}

export function usePageContext() {
  // Tolerate use outside a provider (returns a no-op store) so consumers don't
  // need to guard every call.
  return useContext(PageContext) || { activeProduct: null, setActiveProduct: () => {} };
}
