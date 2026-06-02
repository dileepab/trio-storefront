'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [justAddedId, setJustAddedId] = useState(null);

  // Load from localStorage on mount (prevents SSR hydration mismatches)
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('trio_cart');
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
      const storedFavs = localStorage.getItem('trio_favorites');
      if (storedFavs) {
        setFavorites(JSON.parse(storedFavs));
      }
    } catch (e) {
      console.error('Failed to load local data from localStorage:', e);
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage when items update
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem('trio_cart', JSON.stringify(cartItems));
      } catch (e) {
        console.error('Failed to save cart to localStorage:', e);
      }
    }
  }, [cartItems, isHydrated]);

  // Save favorites to localStorage when updated
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem('trio_favorites', JSON.stringify(favorites));
      } catch (e) {
        console.error('Failed to save favorites to localStorage:', e);
      }
    }
  }, [favorites, isHydrated]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const addToCart = (product, size) => {
    setCartItems(prev => {
      // Unique key based on slug and size
      const itemKey = `${product.slug}-${size}`;
      const existing = prev.find(item => item.key === itemKey);

      if (existing) {
        return prev.map(item => 
          item.key === itemKey 
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }

      return [
        ...prev,
        {
          key: itemKey,
          slug: product.slug,
          title: product.title,
          price: parseInt(product.price.replace(/,/g, '')),
          size: size,
          qty: 1,
          swatchA: product.swatchA,
          swatchB: product.swatchB,
          image: product.image || null,
        }
      ];
    });

    // Trigger micro-animation logic for the badge and drawer open
    setJustAddedId(product.slug);
    setTimeout(() => setJustAddedId(null), 1000);
    openCart();
  };

  const removeFromCart = (key) => {
    setCartItems(prev => prev.filter(item => item.key !== key));
  };

  const updateQty = (key, delta) => {
    setCartItems(prev => 
      prev.map(item => {
        if (item.key === key) {
          const newQty = item.qty + delta;
          return newQty > 0 ? { ...item, qty: newQty } : item;
        }
        return item;
      })
    );
  };

  const toggleFavorite = (slug) => {
    setFavorites(prev => {
      if (prev.includes(slug)) {
        return prev.filter(s => s !== slug);
      }
      return [...prev, slug];
    });
  };

  const isFavorite = (slug) => favorites.includes(slug);

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      isOpen,
      isHydrated,
      justAddedId,
      cartCount,
      favorites,
      openCart,
      closeCart,
      addToCart,
      removeFromCart,
      updateQty,
      toggleFavorite,
      isFavorite,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
