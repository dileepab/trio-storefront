'use client';
import { useState } from 'react';
import { useCart } from '@/lib/cartContext';
import Link from 'next/link';
import { storefrontHref } from '@/lib/storefrontRouting';
import { shippingFor } from '@/lib/shipping';
import PayToggle from './PayToggle';
import ShipProgress from './ShipProgress';

export default function Cart({ brand, basePath }) {
  const { cartItems, updateQty, removeFromCart } = useCart();
  const [payMethod, setPayMethod] = useState('COD');

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shipping = shippingFor(brand, subtotal);
  const delivery = shipping.fee;
  const total = subtotal + delivery;

  const fmt = n => n.toLocaleString('en-LK');
  
  // Brand voice casing rules
  const formatText = (text) => {
    return brand === 'modabella' ? text.toLowerCase() : text;
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart text-center" style={{ padding: '80px 18px' }}>
        <h1 className="h1 cart-title">{formatText('Your bag is empty')}</h1>
        <p className="body" style={{ margin: '20px 0 32px' }}>{formatText('There are no items in your shopping bag.')}</p>
        <Link href={storefrontHref(basePath, '/shop')} className="btn primary lg">
          {formatText('Go back to shop')}
        </Link>
      </div>
    );
  }

  return (
    <div className="cart">
      <h1 className="h1 cart-title">{formatText('Your cart')}</h1>
      <div className="cart-list">
        {cartItems.map(it => (
          <div className="cart-line" key={it.key}>
            <div className="cart-img-container" style={{ width: '80px', height: '100px', overflow: 'hidden', borderRadius: 'var(--radius-sm)' }}>
              {it.image ? (
                <img src={it.image} alt="" className="object-cover w-full h-full" />
              ) : (
                <div className="cart-img" style={{ width: '100%', height: '100%', background: `linear-gradient(160deg, ${it.swatchA}, ${it.swatchB})` }}/>
              )}
            </div>
            <div className="cart-info">
              <div className="cart-line-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div className="cart-name">{formatText(it.title)}</div>
                <button
                  className="cart-line-remove"
                  onClick={() => removeFromCart(it.key)}
                  aria-label={`${formatText('Remove')} ${formatText(it.title)}`}
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="caption" style={{ marginBottom: '4px' }}>
                {formatText('Size')}: {it.size}
                {it.color && <> · {formatText(it.color)}</>}
              </div>
              <div className="cart-row">
                <div className="qty">
                  <button
                    type="button"
                    onClick={() => updateQty(it.key, -1)}
                    aria-label={`${formatText('Decrease quantity of')} ${formatText(it.title)}`}
                  >
                    <span aria-hidden="true">−</span>
                  </button>
                  <span aria-live="polite" aria-atomic="true">
                    <span className="visually-hidden">{formatText('Quantity')}: </span>{it.qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQty(it.key, +1)}
                    aria-label={`${formatText('Increase quantity of')} ${formatText(it.title)}`}
                  >
                    <span aria-hidden="true">+</span>
                  </button>
                </div>
                <span className="price">LKR {fmt(it.price * it.qty)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <ShipProgress brandId={brand} subtotal={subtotal}/>

        <div className="row"><span>{formatText('Subtotal')}</span><span className="price">LKR {fmt(subtotal)}</span></div>
        <div className="row">
          <span>{formatText('Courier (Colombo)')}</span>
          {shipping.qualified
            ? <span className="row-free">{formatText('Free')}</span>
            : <span>LKR {fmt(delivery)}</span>}
        </div>
        <div className="row total"><span>{formatText('Total')}</span><span className="price">LKR {fmt(total)}</span></div>

        <div className="cart-summary-payment">
          <PayToggle brandId={brand} value={payMethod} onChange={setPayMethod}/>
        </div>

        <button className="btn primary lg full">{formatText('Place order')}</button>
      </div>
    </div>
  );
}
