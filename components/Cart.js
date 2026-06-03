'use client';
import { useCart } from '@/lib/cartContext';
import Link from 'next/link';
import { storefrontHref } from '@/lib/storefrontRouting';

export default function Cart({ brand, basePath }) {
  const { cartItems, updateQty, removeFromCart } = useCart();

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const delivery = subtotal > 0 ? 350 : 0;
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
                <img src={it.image} alt={it.title} className="object-cover w-full h-full" />
              ) : (
                <div className="cart-img" style={{ width: '100%', height: '100%', background: `linear-gradient(160deg, ${it.swatchA}, ${it.swatchB})` }}/>
              )}
            </div>
            <div className="cart-info">
              <div className="cart-line-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div className="cart-name">{formatText(it.title)}</div>
                <button 
                  style={{ background: 'transparent', border: 0, color: 'var(--brand-muted)', cursor: 'pointer' }}
                  onClick={() => removeFromCart(it.key)}
                >
                  ×
                </button>
              </div>
              <div className="caption" style={{ marginBottom: '4px' }}>{formatText('Size')}: {it.size}</div>
              <div className="cart-row">
                <div className="qty">
                  <button onClick={() => updateQty(it.key, -1)}>−</button>
                  <span>{it.qty}</span>
                  <button onClick={() => updateQty(it.key, +1)}>+</button>
                </div>
                <span className="price">LKR {fmt(it.price * it.qty)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <div className="row"><span>{formatText('Subtotal')}</span><span className="price">LKR {fmt(subtotal)}</span></div>
        <div className="row"><span>{formatText('Courier (Colombo)')}</span><span>LKR {fmt(delivery)}</span></div>
        <div className="row total"><span>{formatText('Total')}</span><span className="price">LKR {fmt(total)}</span></div>
        <label className="pay">
          <input type="radio" name="pay" defaultChecked/> 
          <span>{formatText('Cash on delivery')}</span>
          <span className="caption">— {formatText('pay when it arrives')}</span>
        </label>
        <label className="pay">
          <input type="radio" name="pay"/> 
          <span>{formatText('Bank transfer')}</span>
          <span className="caption">— {formatText('instant verification')}</span>
        </label>
        <button className="btn primary lg full">{formatText('Place order')}</button>
      </div>
    </div>
  );
}
