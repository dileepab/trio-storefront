'use client';
import { useState } from 'react';
import { useCart } from '@/lib/cartContext';
import { useAuth } from '@/lib/authContext';
import Icon from './Icon';
import AuthModal from './AuthModal';

export default function CartDrawer({ brand }) {
  const { cartItems, isOpen, closeCart, updateQty, removeFromCart, placeOrder } = useCart();
  const { currentUser } = useAuth();
  
  const [payMethod, setPayMethod] = useState('COD');
  const [orderSuccessNum, setOrderSuccessNum] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const delivery = subtotal > 0 ? 350 : 0;
  const total = subtotal + delivery;

  const fmt = (num) => num.toLocaleString('en-LK');
  const brandSlug = brand.id;

  // Handle lowercase brand voice rules for Modabella
  const formatText = (text) => {
    return brandSlug === 'modabella' ? text.toLowerCase() : text;
  };

  const handleCheckoutClick = () => {
    if (!currentUser) {
      setAuthOpen(true);
      return;
    }

    // Place order under active logged in user
    const order = placeOrder(
      currentUser.id,
      brandSlug,
      currentUser.address,
      payMethod
    );

    if (order) {
      setOrderSuccessNum(order.orderNumber);
    }
  };

  return (
    <div className="cart-drawer-overlay" onClick={closeCart}>
      {/* Drawer Panel */}
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cart-drawer-head">
          <div>
            <h2 className="h3 cart-drawer-title">{formatText('Shopping Bag')}</h2>
            <span className="caption">
              {orderSuccessNum ? '0' : cartItems.length} {formatText('unique items')}
            </span>
          </div>
          <button className="cart-drawer-close" onClick={closeCart} aria-label="Close cart">
            ×
          </button>
        </div>

        {/* List (Scrollable) */}
        <div className="cart-drawer-body">
          {orderSuccessNum ? (
            /* Order Success View */
            <div className="cart-drawer-empty" style={{ gap: '16px', margin: 'auto', padding: '10px 0' }}>
              <div 
                style={{ 
                  width: '64px', height: '64px', borderRadius: '50%', 
                  background: 'color-mix(in srgb, var(--brand-primary) 10%, transparent)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--brand-primary)', fontSize: '28px', margin: '0 auto 8px' 
                }}
              >
                ✓
              </div>
              <h3 className="h3" style={{ margin: 0, fontWeight: '600' }}>
                {formatText('Order Placed Successfully!')}
              </h3>
              <p className="body-sm" style={{ margin: 0, color: 'var(--brand-muted)' }}>
                {formatText('Thank you for shopping with us. Your order reference number is:')}
              </p>
              <div 
                style={{ 
                  background: 'var(--brand-surface-2)', padding: '10px 16px', 
                  borderRadius: 'var(--radius-sm)', fontWeight: '700', 
                  fontSize: '18px', color: 'var(--brand-primary)', border: '1px dashed var(--brand-border)' 
                }}
              >
                {orderSuccessNum}
              </div>
              <p className="caption" style={{ margin: 0, lineHeight: '1.4' }}>
                {formatText('We will package your order immediately. You can view progress under your Account Order History!')}
              </p>
              <button 
                className="btn primary lg full" 
                style={{ marginTop: '12px' }}
                onClick={() => {
                  setOrderSuccessNum(null);
                  closeCart();
                }}
              >
                {formatText('Continue shopping')}
              </button>
            </div>
          ) : cartItems.length === 0 ? (
            /* Empty State */
            <div className="cart-drawer-empty">
              <Icon name="cart" size={48} />
              <p className="body">{formatText('Your bag is currently empty.')}</p>
              <button className="btn primary lg" onClick={closeCart}>
                {formatText('Continue shopping')}
              </button>
            </div>
          ) : (
            /* Items List */
            <div className="cart-drawer-list">
              {cartItems.map((item) => (
                <div className="cart-drawer-line" key={item.key}>
                  {/* Left: Garment Image or Swatch Gradient */}
                  <div className="cart-drawer-img-container">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="cart-drawer-img object-cover"
                      />
                    ) : (
                      <div 
                        className="cart-drawer-img" 
                        style={{ background: `linear-gradient(160deg, ${item.swatchA}, ${item.swatchB})` }}
                      />
                    )}
                  </div>

                  {/* Right: Info */}
                  <div className="cart-drawer-info">
                    <div className="cart-drawer-line-top">
                      <div className="cart-drawer-name">{formatText(item.title)}</div>
                      <button 
                        className="cart-drawer-delete" 
                        onClick={() => removeFromCart(item.key)}
                        aria-label="Remove item"
                      >
                        🗑
                      </button>
                    </div>
                    
                    <div className="caption cart-drawer-variant">
                      {formatText('Size')}: <span className="size-label">{item.size}</span>
                    </div>

                    <div className="cart-drawer-row">
                      <div className="qty cart-drawer-qty">
                        <button onClick={() => updateQty(item.key, -1)}>−</button>
                        <span>{item.qty}</span>
                        <button onClick={() => updateQty(item.key, 1)}>+</button>
                      </div>
                      <span className="price">LKR {fmt(item.price * item.qty)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Checkout Sticky Summary */}
        {!orderSuccessNum && cartItems.length > 0 && (
          <div className="cart-drawer-summary">
            <div className="row">
              <span>{formatText('Subtotal')}</span>
              <span className="price">LKR {fmt(subtotal)}</span>
            </div>
            <div className="row">
              <span>{formatText('Courier delivery')}</span>
              <span>LKR {fmt(delivery)}</span>
            </div>
            <div className="row total">
              <span>{formatText('Total')}</span>
              <span className="price">LKR {fmt(total)}</span>
            </div>

            <div className="cart-drawer-payment">
              <label className="pay">
                <input 
                  type="radio" 
                  name="drawer_pay" 
                  checked={payMethod === 'COD'}
                  onChange={() => setPayMethod('COD')}
                /> 
                <span>{formatText('Cash on delivery')}</span>
                <span className="caption">— {formatText('pay at door')}</span>
              </label>
              <label className="pay">
                <input 
                  type="radio" 
                  name="drawer_pay" 
                  checked={payMethod === 'Bank'}
                  onChange={() => setPayMethod('Bank')}
                /> 
                <span>{formatText('Bank transfer')}</span>
                <span className="caption">— {formatText('instant approval')}</span>
              </label>
            </div>

            <button 
              className="btn primary lg full cart-drawer-checkout"
              onClick={handleCheckoutClick}
            >
              {formatText('Place order')}
            </button>
          </div>
        )}
      </div>

      {/* Guest Authentication Modal Trigger */}
      <AuthModal 
        isOpen={authOpen} 
        onClose={() => setAuthOpen(false)} 
        brandId={brandSlug}
      />
    </div>
  );
}
