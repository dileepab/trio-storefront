'use client';
import { useEffect, useId, useState } from 'react';
import { useCart } from '@/lib/cartContext';
import { useAuth } from '@/lib/authContext';
import { useDialog } from '@/lib/useDialog';
import Icon from './Icon';
import AuthModal from './AuthModal';
import PayToggle from './PayToggle';
import ShipProgress from './ShipProgress';
import { shippingFor } from '@/lib/shipping';

export default function CartDrawer({ brand }) {
  const { cartItems, isOpen, closeCart, updateQty, removeFromCart, placeOrder } = useCart();
  const { currentUser } = useAuth();

  const [payMethod, setPayMethod] = useState('COD');
  const [orderSuccessNum, setOrderSuccessNum] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [isPlacing, setIsPlacing] = useState(false);
  const [orderError, setOrderError] = useState(null);
  // Where the order is actually going. Requiring an account first loses the
  // sale, and the account we have holds one free-text address the courier
  // cannot route on.
  const [details, setDetails] = useState({
    name: '',
    phone: '',
    streetAddress: '',
    city: '',
    district: '',
  });

  useEffect(() => {
    if (!currentUser) return;
    setDetails((prev) => ({
      ...prev,
      name: prev.name || currentUser.name || '',
      phone: prev.phone || currentUser.phone || '',
      streetAddress: prev.streetAddress || currentUser.address || '',
    }));
  }, [currentUser]);

  const uid = useId();
  const titleId = `${uid}-title`;
  const { panelRef, dialogProps } = useDialog({
    isOpen,
    onClose: closeCart,
    labelledBy: titleId,
  });

  if (!isOpen) return null;

  const brandSlug = brand.id;
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shipping = shippingFor(brandSlug, subtotal);
  const delivery = shipping.fee;
  const total = subtotal + delivery;

  const fmt = (num) => num.toLocaleString('en-LK');

  // Handle lowercase brand voice rules for Modabella
  const formatText = (text) => {
    return brandSlug === 'modabella' ? text.toLowerCase() : text;
  };

  const setField = (field) => (event) =>
    setDetails((prev) => ({ ...prev, [field]: event.target.value }));

  const canPlace =
    details.name.trim().length > 1 &&
    details.phone.replace(/\D/g, '').length >= 9 &&
    details.streetAddress.trim().length > 3 &&
    details.city.trim().length > 1;

  const handleCheckoutClick = async () => {
    if (isPlacing) return;

    setOrderError(null);
    setIsPlacing(true);

    const result = await placeOrder(brandSlug, details);

    setIsPlacing(false);

    if (result.ok) {
      setOrderSuccessNum(`ORD-${result.orderId}`);
      return;
    }

    setOrderError(result.error);
  };

  return (
    <div className="cart-drawer-overlay" onClick={closeCart}>
      {/* Drawer Panel */}
      <div
        className="cart-drawer"
        ref={panelRef}
        {...dialogProps}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="cart-drawer-head">
          <div>
            <h2 className="h3 cart-drawer-title" id={titleId}>{formatText('Shopping Bag')}</h2>
            <span className="caption">
              {orderSuccessNum ? '0' : cartItems.length} {formatText('unique items')}
            </span>
          </div>
          <button type="button" className="cart-drawer-close" onClick={closeCart} aria-label={formatText('Close cart')}>
            <span aria-hidden="true">×</span>
          </button>
        </div>

        {/* List (Scrollable) */}
        <div className="cart-drawer-body">
          {orderSuccessNum ? (
            /* Order Success View — role="status" so the confirmation and the
               order number are announced, not just painted. */
            <div className="cart-drawer-empty" role="status" style={{ gap: '16px', margin: 'auto', padding: '10px 0' }}>
              <div 
                style={{ 
                  width: '64px', height: '64px', borderRadius: '50%', 
                  background: 'color-mix(in srgb, var(--brand-primary) 10%, transparent)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--brand-primary)', fontSize: '28px', margin: '0 auto 8px'
                }}
                aria-hidden="true"
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
            <ul className="cart-drawer-list">
              {cartItems.map((item) => (
                <li className="cart-drawer-line" key={item.key}>
                  {/* Left: Garment Image or Swatch Gradient */}
                  <div className="cart-drawer-img-container">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt=""
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
                        type="button"
                        className="cart-drawer-delete"
                        onClick={() => removeFromCart(item.key)}
                        aria-label={`${formatText('Remove')} ${formatText(item.title)}, ${formatText('size')} ${item.size}`}
                      >
                        <span aria-hidden="true">🗑</span>
                      </button>
                    </div>
                    
                    <div className="caption cart-drawer-variant">
                      {formatText('Size')}: <span className="size-label">{item.size}</span>
                      {item.color && <> <span className="size-label">{formatText(item.color)}</span></>}
                    </div>

                    <div className="cart-drawer-row">
                      {/* "−" / "+" alone told a screen reader nothing about
                          what was being changed, or of which item. */}
                      <div className="qty cart-drawer-qty">
                        <button
                          type="button"
                          onClick={() => updateQty(item.key, -1)}
                          aria-label={`${formatText('Decrease quantity of')} ${formatText(item.title)}`}
                        >
                          <span aria-hidden="true">−</span>
                        </button>
                        <span aria-live="polite" aria-atomic="true">
                          <span className="visually-hidden">{formatText('Quantity')}: </span>{item.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQty(item.key, 1)}
                          aria-label={`${formatText('Increase quantity of')} ${formatText(item.title)}`}
                        >
                          <span aria-hidden="true">+</span>
                        </button>
                      </div>
                      <span className="price">LKR {fmt(item.price * item.qty)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Bottom Checkout Sticky Summary */}
        {!orderSuccessNum && cartItems.length > 0 && (
          <div className="cart-drawer-summary">
            <ShipProgress brandId={brandSlug} subtotal={subtotal}/>

            <div className="row">
              <span>{formatText('Subtotal')}</span>
              <span className="price">LKR {fmt(subtotal)}</span>
            </div>
            <div className="row">
              <span>{formatText('Courier delivery')}</span>
              {shipping.qualified
                ? <span className="row-free">{formatText('Free')}</span>
                : <span>LKR {fmt(delivery)}</span>}
            </div>
            <div className="row total">
              <span>{formatText('Total')}</span>
              <span className="price">LKR {fmt(total)}</span>
            </div>

            <div className="cart-drawer-payment">
              <PayToggle brandId={brandSlug} value={payMethod} onChange={setPayMethod}/>
            </div>

            <div className="cart-drawer-details">
              <label>
                <span className="visually-hidden">{formatText('Full name')}</span>
                <input
                  className="form-input"
                  type="text"
                  autoComplete="name"
                  placeholder={formatText('Full name')}
                  value={details.name}
                  onChange={setField('name')}
                  disabled={isPlacing}
                  required
                />
              </label>
              <label>
                <span className="visually-hidden">{formatText('Mobile number')}</span>
                <input
                  className="form-input"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder={formatText('Mobile number (07XXXXXXXX)')}
                  value={details.phone}
                  onChange={setField('phone')}
                  disabled={isPlacing}
                  required
                />
              </label>
              <label>
                <span className="visually-hidden">{formatText('Address')}</span>
                <input
                  className="form-input"
                  type="text"
                  autoComplete="street-address"
                  placeholder={formatText('House number and street')}
                  value={details.streetAddress}
                  onChange={setField('streetAddress')}
                  disabled={isPlacing}
                  required
                />
              </label>
              {/* City and district are asked separately because the courier
                  matches on them, and a district typed into the city box is
                  what makes a waybill fail after the sale is made. */}
              <label>
                <span className="visually-hidden">{formatText('City')}</span>
                <input
                  className="form-input"
                  type="text"
                  autoComplete="address-level2"
                  placeholder={formatText('City / town')}
                  value={details.city}
                  onChange={setField('city')}
                  disabled={isPlacing}
                  required
                />
              </label>
              <label>
                <span className="visually-hidden">{formatText('District')}</span>
                <input
                  className="form-input"
                  type="text"
                  autoComplete="address-level1"
                  placeholder={formatText('District')}
                  value={details.district}
                  onChange={setField('district')}
                  disabled={isPlacing}
                />
              </label>
            </div>

            {orderError && (
              <p className="cart-drawer-error" role="alert">{orderError}</p>
            )}

            <button
              className="btn primary lg full cart-drawer-checkout"
              onClick={handleCheckoutClick}
              disabled={!canPlace || isPlacing}
            >
              {isPlacing ? formatText('Placing order...') : formatText('Place order')}
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
