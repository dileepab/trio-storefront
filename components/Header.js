'use client';
import { useEffect, useId, useState } from 'react';
import Link from 'next/link';
import Icon from './Icon';
import { useCart } from '@/lib/cartContext';
import { useAuth } from '@/lib/authContext';
import { useI18n } from '@/lib/i18n';
import { useDialog } from '@/lib/useDialog';
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
  const [scrolled, setScrolled] = useState(false);

  const drawerTitleId = useId();
  const drawerLangId = useId();
  const { panelRef: drawerRef, dialogProps: drawerDialogProps } = useDialog({
    isOpen: mobileMenuOpen,
    onClose: () => setMobileMenuOpen(false),
    labelledBy: drawerTitleId,
  });

  // Elevate the header subtly once the page scrolls past the hero edge
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
    <header className={`sf-header${scrolled ? ' is-scrolled' : ''}`}>
      <button 
        className="icon-btn sf-mobile-only" 
        aria-label="Menu" 
        onClick={() => setMobileMenuOpen(true)}
      >
        <Icon name="menu"/>
      </button>
      <Link href={storefrontHref(basePath)} className="sf-logo">
        <img src={brand.logo} alt={brand.name}/>
      </Link>
      
      <nav className="sf-nav sf-desktop-only" aria-label={formatText('Primary')}>
        {/* Lookbook active tag */}
        <Link href={storefrontHref(basePath, '/lookbook')} className="sf-nav-featured">
          ✨ {t('Shop the Look', brand.id)}
        </Link>
        <span className="sf-nav-sep" aria-hidden="true"/>
        {brand.nav.map(n => (
          <Link key={n} href={storefrontHref(basePath, '/shop')}>{t(n, brand.id)}</Link>
        ))}
      </nav>

      <div className="sf-header-actions">
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
          className="icon-btn sf-account-btn"
          aria-label="Account"
          onClick={handleAccountClick}
        >
          {currentUser && (
            <span className="caption sf-account-name sf-desktop-only">
              {formatText(currentUser.name)}
            </span>
          )}
          <Icon name="user"/>
        </button>

        {/* The count lives in the label, not just the pill: aria-label replaces
            the button's content, so "Cart" alone hid the number from AT. */}
        <button
          onClick={openCart}
          className="icon-btn cart-btn"
          aria-label={cartCount > 0 ? `Cart, ${cartCount} ${cartCount === 1 ? 'item' : 'items'}` : 'Cart, empty'}
        >
          <Icon name="cart"/>
          {cartCount > 0 && (
            <span className={`cart-pill ${justAddedId ? 'cart-pop-trigger' : ''}`} aria-hidden="true">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div
            className="mobile-drawer"
            ref={drawerRef}
            {...drawerDialogProps}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mobile-drawer-head">
              {brand.logo ? (
                <div className="mobile-drawer-logo">
                  <img src={brand.logo} alt={brand.name} />
                </div>
              ) : (
                <span className="eyebrow" style={{ fontSize: '14px', letterSpacing: '0.1em' }}>
                  {formatText(brand.name)}
                </span>
              )}
              {/* Names the dialog for assistive tech without adding visible copy */}
              <span id={drawerTitleId} className="visually-hidden">
                {formatText(`${brand.name} menu`)}
              </span>
              <button
                className="mobile-drawer-close"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>

            <div className="mobile-drawer-body">
              {/* Language Selector */}
              <div className="mobile-drawer-section">
                <label className="caption mobile-drawer-label" htmlFor={drawerLangId}>
                  {formatText('Select Language')}
                </label>
                <select
                  id={drawerLangId}
                  value={locale}
                  onChange={(e) => {
                    changeLocale(e.target.value);
                    setMobileMenuOpen(false);
                  }}
                  className="lang-picker mobile-drawer-lang"
                >
                  <option value="en">English (EN)</option>
                  <option value="si">සිංහල (Sinhala)</option>
                  <option value="ta">தமிழ් (Tamil)</option>
                </select>
              </div>

              {/* Navigation Links */}
              <div className="mobile-drawer-section">
                {/* <label> is only for form controls — this heads a <nav> */}
                <h2 className="caption mobile-drawer-label">
                  {formatText('Categories')}
                </h2>
                <nav className="mobile-drawer-nav" aria-label={formatText('Categories')}>
                  <Link
                    href={storefrontHref(basePath, '/lookbook')}
                    onClick={() => setMobileMenuOpen(false)}
                    className="mobile-drawer-featured"
                  >
                    ✨ {t('Shop the Look', brand.id)}
                  </Link>
                  {brand.nav.map(n => (
                    <Link
                      key={n}
                      href={storefrontHref(basePath, '/shop')}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t(n, brand.id)}
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Account Link */}
              <div className="mobile-drawer-section mobile-drawer-account">
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
