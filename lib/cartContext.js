'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { captureAdClickId, readAdClickId } from './adClick';
import { shippingFor } from './shipping';

const CartContext = createContext(null);

export function CartProvider({ children, brandId }) {
  const [cartItems, setCartItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [justAddedId, setJustAddedId] = useState(null);

  // Load from localStorage on mount or when brand changes (prevents SSR hydration mismatches)
  // On arrival, before the shopper navigates away from the landing URL that
  // carries the ad click reference.
  useEffect(() => {
    captureAdClickId();
  }, []);

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

  // `color` is optional — when omitted the key matches the previous
  // slug-size format, so carts already in localStorage stay valid.
  /**
   * Platform slugs end in the product's id, so it survives a page that only
   * kept the slug.
   */
  const productIdFromSlug = (slug) => {
    const match = /-(\d+)$/.exec(String(slug || ''));
    return match ? Number(match[1]) : null;
  };

  const addToCart = (product, size, color = null) => {
    setCartItems(prev => {
      // Unique key based on slug, size and (when chosen) colour
      const itemKey = color ? `${product.slug}-${size}-${color}` : `${product.slug}-${size}`;
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
          // The platform's own id. Demo products have none and cannot be
          // ordered, which is correct — they are not real inventory.
          productId: product.id ?? productIdFromSlug(product.slug),
          slug: product.slug,
          title: product.title,
          price: parseInt(product.price.replace(/,/g, '')),
          size: size,
          color: color,
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

  /**
   * Sends the order to the platform, which is what makes it an order.
   *
   * This used to build an object, push it into state and return it, so a
   * shopper saw a confirmation for something nobody ever received.
   */
  const placeOrder = async (brandId, details) => {
    const items = cartItems
      .filter(item => item.productId)
      .map(item => ({
        productId: item.productId,
        quantity: item.qty,
        size: item.size || undefined,
        color: item.color || undefined,
      }));

    if (!items.length) {
      return { ok: false, error: 'These items cannot be ordered online yet. Please message us.' };
    }

    try {
      // This site's own route, which forwards to the platform. Same origin, so
      // the platform's address stays out of the browser bundle.
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand: brandId,
          name: details.name,
          phone: details.phone,
          streetAddress: details.streetAddress,
          city: details.city,
          district: details.district,
          adClickId: readAdClickId(),
          items,
        }),
      });

      const body = await response.json().catch(() => null);

      if (!response.ok || !body?.success) {
        return { ok: false, error: body?.error || 'We could not place that order. Please try again.' };
      }

      // Kept so the profile page can show what was just bought. The record
      // is what the shop confirmed, not a guess made in the browser.
      setOrders(prev => [
        {
          id: `order-${body.data.orderId}`,
          orderNumber: `ORD-${body.data.orderId}`,
          brandId,
          items: [...cartItems],
          totalAmount: body.data.totalAmount,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);

      setCartItems([]);
      return { ok: true, orderId: body.data.orderId, totalAmount: body.data.totalAmount };
    } catch {
      // A failed network call must not clear the cart, or the shopper loses
      // their selection and the sale with it.
      return { ok: false, error: 'We could not reach the shop. Please check your connection.' };
    }
  };

  /**
   * What the shop has actually told us, which is only that the order arrived.
   *
   * This used to invent a delivery timeline from elapsed seconds, so a shopper
   * was shown "Delivered" ninety seconds after ordering. Real progress lives
   * in the platform and needs an endpoint of its own before it can be shown.
   */
  const getOrderStatus = () => 'Placed';

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
