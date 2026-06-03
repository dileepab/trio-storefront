'use client';
import { useState } from 'react';
import Link from 'next/link';
import Icon from './Icon';
import { useCart } from '@/lib/cartContext';
import { useAuth } from '@/lib/authContext';
import { useI18n } from '@/lib/i18n';
import { storefrontHref } from '@/lib/storefrontRouting';
import AuthModal from './AuthModal';
import ProfileDashboard from './ProfileDashboard';

export default function Header({ brand, basePath }) {
  const { cartCount, openCart, justAddedId } = useCart();
  const { currentUser } = useAuth();
  const { locale, t, changeLocale } = useI18n();

  const [authOpen, setAuthOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleAccountClick = () => {
    if (currentUser) {
      setProfileOpen(true);
    } else {
      setAuthOpen(true);
    }
  };

  const isModa = brand.id === 'modabella';

  const formatText = (text) => {
    return isModa ? text.toLowerCase() : text;
  };

  return (
    <header className="sf-header">
      <button 
        className="icon-btn sf-mobile-only" 
        aria-label="Menu" 
        onClick={() => setMobileMenuOpen(true)}
      >
        <Icon name="menu"/>
      </button>
      <Link href={storefrontHref(basePath)} className="sf-logo">
        <img src={`/logos/${brand.id}.svg`} alt={brand.name}/>
      </Link>
      
      <nav className="sf-nav sf-desktop-only">
        {/* Lookbook active tag */}
        <Link href={storefrontHref(basePath, '/lookbook')} style={{ fontWeight: '600', color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          ✨ {t('Shop the Look', brand.id)}
        </Link>
        <span style={{ color: 'var(--brand-border)' }}>|</span>
        {brand.nav.map(n => (
          <Link key={n} href={storefrontHref(basePath, '/shop')}>{t(n, brand.id)}</Link>
        ))}
      </nav>

      <div className="sf-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Language Picker Dropdown (Desktop Only in Header) */}
        <select 
          value={locale} 
          onChange={(e) => changeLocale(e.target.value)} 
          className="lang-picker sf-desktop-only"
          aria-label="Select language"
        >
          <option value="en">EN</option>
          <option value="si">සිංහල</option>
          <option value="ta">தமிழ்</option>
        </select>

        <button className="icon-btn" aria-label="Search"><Icon name="search"/></button>
        
        {/* Account Button with dynamic username label */}
        <button 
          className="icon-btn" 
          aria-label="Account"
          onClick={handleAccountClick}
          style={{ display: 'inline-flex', gap: '6px', width: 'auto', padding: '0 10px' }}
        >
          {currentUser && (
            <span className="caption sf-desktop-only" style={{ fontWeight: '600', color: 'var(--brand-primary)' }}>
              {formatText(currentUser.name)}
            </span>
          )}
          <Icon name="user"/>
        </button>

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

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-drawer-head">
              <span className="eyebrow" style={{ fontSize: '14px', letterSpacing: '0.1em' }}>
                {formatText(brand.name)}
              </span>
              <button 
                className="mobile-drawer-close" 
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                ×
              </button>
            </div>
            
            <div className="mobile-drawer-body">
              {/* Language Selector */}
              <div className="mobile-drawer-section">
                <label className="caption" style={{ marginBottom: '8px', display: 'block', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {formatText('Select Language')}
                </label>
                <select 
                  value={locale} 
                  onChange={(e) => {
                    changeLocale(e.target.value);
                    setMobileMenuOpen(false);
                  }} 
                  className="lang-picker"
                  style={{ width: '100%', height: '40px', fontSize: '13px' }}
                >
                  <option value="en">English (EN)</option>
                  <option value="si">සිංහල (Sinhala)</option>
                  <option value="ta">தமிழ் (Tamil)</option>
                </select>
              </div>

              {/* Navigation Links */}
              <div className="mobile-drawer-section" style={{ marginTop: '16px' }}>
                <label className="caption" style={{ marginBottom: '12px', display: 'block', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {formatText('Categories')}
                </label>
                <nav className="mobile-drawer-nav">
                  <Link 
                    href={storefrontHref(basePath, '/lookbook')} 
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ fontWeight: '600', color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', gap: '6px', padding: '12px 0', borderBottom: '1px solid var(--brand-border-subtle)' }}
                  >
                    ✨ {t('Shop the Look', brand.id)}
                  </Link>
                  {brand.nav.map(n => (
                    <Link 
                      key={n} 
                      href={storefrontHref(basePath, '/shop')}
                      onClick={() => setMobileMenuOpen(false)}
                      style={{ display: 'block', padding: '12px 0', borderBottom: '1px solid var(--brand-border-subtle)', color: 'var(--brand-text)' }}
                    >
                      {t(n, brand.id)}
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Account Link */}
              <div className="mobile-drawer-section" style={{ marginTop: 'auto', borderTop: '1px solid var(--brand-border-subtle)', paddingTop: '20px' }}>
                <button 
                  className="btn primary lg full"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleAccountClick();
                  }}
                >
                  <Icon name="user" size={16}/>
                  {currentUser ? formatText(currentUser.name) : formatText('My Account')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Persistent Modals */}
      <AuthModal 
        isOpen={authOpen} 
        onClose={() => setAuthOpen(false)} 
        brandId={brand.id}
      />
      
      {currentUser && (
        <ProfileDashboard 
          isOpen={profileOpen} 
          onClose={() => setProfileOpen(false)} 
          brandId={brand.id}
        />
      )}
    </header>
  );
}
