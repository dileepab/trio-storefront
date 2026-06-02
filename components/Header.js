'use client';
import Link from 'next/link';
import Icon from './Icon';
import { useCart } from '@/lib/cartContext';
import { useI18n } from '@/lib/i18n';

export default function Header({ brand }) {
  const { cartCount, openCart, justAddedId } = useCart();
  const { locale, t, changeLocale } = useI18n();

  return (
    <header className="sf-header">
      <button className="icon-btn sf-mobile-only" aria-label="Menu"><Icon name="menu"/></button>
      <Link href={`/${brand.id}`} className="sf-logo">
        <img src={`/logos/${brand.id}.svg`} alt={brand.name}/>
      </Link>
      
      <nav className="sf-nav sf-desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* Lookbook active tag */}
        <Link href={`/${brand.id}/lookbook`} style={{ fontWeight: '600', color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          ✨ {t('Shop the Look', brand.id)}
        </Link>
        <span style={{ color: 'var(--brand-border)' }}>|</span>
        {brand.nav.map(n => (
          <Link key={n} href={`/${brand.id}/shop`}>{t(n, brand.id)}</Link>
        ))}
      </nav>

      <div className="sf-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Language Picker Dropdown */}
        <select 
          value={locale} 
          onChange={(e) => changeLocale(e.target.value)} 
          className="lang-picker"
          aria-label="Select language"
        >
          <option value="en">EN</option>
          <option value="si">සිංහල</option>
          <option value="ta">தமிழ்</option>
        </select>

        <button className="icon-btn" aria-label="Search"><Icon name="search"/></button>
        <button className="icon-btn sf-desktop-only" aria-label="Account"><Icon name="user"/></button>
        <button 
          onClick={openCart} 
          className="icon-btn cart-btn" 
          aria-label="Cart"
        >
          <Icon name="cart"/>
          {cartCount > 0 && (
            <span className={`cart-pill ${justAddedId ? 'cart-pop-trigger' : ''}`}>
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
