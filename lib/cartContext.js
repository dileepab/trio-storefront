'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children, brandId }) {
  const [cartItems, setCartItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [justAddedId, setJustAddedId] = useState(null);

  // Load from localStorage on mount or when brand changes (prevents SSR hydration mismatches)
  useEffect(() => {
    if (!brandId) return;
    try {
      const storedCart = localStorage.getItem(`trio_cart_${brandId}`);
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      } else {
        setCartItems([]);
      }
      const storedFavs = localStorage.getItem(`trio_favorites_${brandId}`);
      if (storedFavs) {
        setFavorites(JSON.parse(storedFavs));
      } else {
        setFavorites([]);
      }
      const storedOrders = localStorage.getItem('trio_orders');
      if (storedOrders) {
        setOrders(JSON.parse(storedOrders));
      }
    } catch (e) {
      console.error('Failed to load local data from localStorage:', e);
    }
    setIsHydrated(true);
  }, [brandId]);

  // Save to localStorage when items update
  useEffect(() => {
    if (isHydrated && brandId) {
      try {
        localStorage.setItem(`trio_cart_${brandId}`, JSON.stringify(cartItems));
      } catch (e) {
        console.error('Failed to save cart to localStorage:', e);
      }
    }
  }, [cartItems, isHydrated, brandId]);

  // Save favorites to localStorage when updated
  useEffect(() => {
    if (isHydrated && brandId) {
      try {
        localStorage.setItem(`trio_favorites_${brandId}`, JSON.stringify(favorites));
      } catch (e) {
        console.error('Failed to save favorites to localStorage:', e);
      }
    }
  }, [favorites, isHydrated, brandId]);

  // Save orders to localStorage when updated
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem('trio_orders', JSON.stringify(orders));
      } catch (e) {
        console.error('Failed to save orders to localStorage:', e);
      }
    }
  }, [orders, isHydrated]);

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

  const placeOrder = (userId, brandId, shippingDetails, paymentMethod) => {
    const brandPrefix = brandId === 'happybuy' ? 'HB' : brandId === 'cleopatra' ? 'CP' : 'MB';
    const orderNum = `${brandPrefix}-${Math.floor(100000 + Math.random() * 900000)}`;
    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const delivery = 350;
    const totalAmount = subtotal + delivery;

    const newOrder = {
      id: `order-${Date.now()}`,
      orderNumber: orderNum,
      userId: userId || 'guest',
      brandId,
      items: [...cartItems],
      subtotal,
      delivery,
      totalAmount,
      shippingDetails,
      paymentMethod,
      createdAt: new Date().toISOString(),
    };

    setOrders(prev => [newOrder, ...prev]);
    setCartItems([]); // Clear cart
    return newOrder;
  };

  // Helper to dynamically calculate dynamic status flows based on elapsed time (high-fidelity mock)
  const getOrderStatus = (order) => {
    const elapsedSeconds = (Date.now() - new Date(order.createdAt).getTime()) / 1000;
    if (elapsedSeconds < 25) {
      return 'Pending';
    } else if (elapsedSeconds < 90) {
      return 'Shipped (In transit)';
    } else {
      return 'Delivered';
    }
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      isOpen,
      isHydrated,
      justAddedId,
      cartCount,
      favorites,
      orders,
      openCart,
      closeCart,
      addToCart,
      removeFromCart,
      updateQty,
      toggleFavorite,
      isFavorite,
      placeOrder,
      getOrderStatus,
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
