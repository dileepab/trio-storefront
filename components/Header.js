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

function getUserInitials(name) {
  if (!name || typeof name !== 'string') return 'U';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

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
      
      {/* The lookbook holds a single look, and this was the most prominent
          link on the page — including on the product page an ad lands on,
          where the brightest thing in view pointed away from the sale. The
          page still exists at /lookbook. */}
      <nav className="sf-nav sf-desktop-only" aria-label={formatText('Primary')}>
        {brand.nav.map(n => (
          <Link key={n} href={storefrontHref(basePath, '/shop')}>{t(n, brand.id)}</Link>
        ))}
      </nav>

      <div className="sf-header-actions">
        {/* Kept a native select: it opens the platform's own picker on a
            phone, which is where most of these shoppers are. The wrapper
            exists only to draw a chevron that inherits the text colour. */}
        <span className="lang-picker-wrap sf-desktop-only">
          <select
            value={locale}
            onChange={(e) => changeLocale(e.target.value)}
            className="lang-picker"
            aria-label="Select language"
          >
            <option value="en">English</option>
            <option value="si">සිංහල</option>
            <option value="ta">தமிழ்</option>
          </select>
        </span>


        {/* Account Button with user initials avatar badge */}
        <button
          className="icon-btn sf-account-btn"
          aria-label={currentUser ? `Account: ${currentUser.name}` : 'Account'}
          title={currentUser ? currentUser.name : 'Account'}
          onClick={handleAccountClick}
        >
          {currentUser ? (
            <div className="sf-user-avatar">
              <span>{getUserInitials(currentUser.name)}</span>
            </div>
          ) : (
            <Icon name="user"/>
          )}
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
                  <option value="ta">தமிழ் (Tamil)</option>
                </select>
              </div>

              {/* Navigation Links */}
              <div className="mobile-drawer-section">
                {/* <label> is only for form controls — this heads a <nav> */}
                <h2 className="caption mobile-drawer-label">
                  {formatText('Categories')}
                </h2>
                <nav className="mobile-drawer-nav" aria-label={formatText('Categories')}>
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
                  {currentUser ? (
                    <>
                      <div className="sf-user-avatar sm">
                        <span>{getUserInitials(currentUser.name)}</span>
                      </div>
                      <span>{formatText(currentUser.name)}</span>
                    </>
                  ) : (
                    <>
                      <Icon name="user" size={16}/>
                      {formatText('My Account')}
                    </>
                  )}
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
