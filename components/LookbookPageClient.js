'use client';
import { useState } from 'react';
import { useCart } from '@/lib/cartContext';
import { useI18n } from '@/lib/i18n';
import Link from 'next/link';
import { storefrontHref } from '@/lib/storefrontRouting';

export default function LookbookPageClient({ brand, products, basePath }) {
  const { t } = useI18n();
  const { addToCart } = useCart();
  const [activeHotspot, setActiveHotspot] = useState(false);
  const featuredProduct = products.find(p => p.image) || products[0];
  const sizeOptions = featuredProduct?.sizes?.length ? featuredProduct.sizes : ['S', 'M', 'L'];
  const [selectedSize, setSelectedSize] = useState(sizeOptions.includes('M') ? 'M' : sizeOptions[0]);

  if (!featuredProduct) {
    return null;
  }

  const hotspotCoords = {
    happybuy: { top: '48%', left: '50%' },
    cleopatra: { top: '52%', left: '46%' },
    modabella: { top: '42%', left: '51%' },
  };

  const coords = hotspotCoords[brand.id] || { top: '50%', left: '50%' };

  return (
    <main className="lookbook-page">
      <div className="lookbook-head text-center">
        <span className="eyebrow">{t('Interactive Hotspots', brand.id)}</span>
        <h1 className="h1 lookbook-title">{t('Shop the Look', brand.id)}</h1>
        <p className="caption">{t('Tap any pulser to buy the look', brand.id)}</p>
      </div>

      <div className="lookbook-canvas-wrapper">
        <div className="lookbook-canvas">
          {featuredProduct.image ? (
            <img
              src={featuredProduct.image}
              alt={t(featuredProduct.title, brand.id)}
              className="lookbook-bg-image object-cover"
            />
          ) : (
            <div
              className="lookbook-bg-image lookbook-bg-gradient"
              style={{ background: `linear-gradient(135deg, ${featuredProduct.swatchA}, ${featuredProduct.swatchB})` }}
            />
          )}

          <button
            className={`hotspot-pulser ${activeHotspot ? 'is-active' : ''}`}
            style={{ top: coords.top, left: coords.left }}
            onClick={() => setActiveHotspot(!activeHotspot)}
            aria-label="Reveal product details"
          >
            <span className="pulser-glow" />
            <span className="pulser-core" />
          </button>

          {activeHotspot && (
            <div className="lookbook-pop glass-header" style={{ top: `calc(${coords.top} + 25px)`, left: `calc(${coords.left} - 120px)` }}>
              <div className="lookbook-pop-head">
                <h3 className="lookbook-pop-title">{t(featuredProduct.title, brand.id)}</h3>
                <button className="lookbook-pop-close" onClick={() => setActiveHotspot(false)}>×</button>
              </div>
              <div className="lookbook-pop-price price">LKR {featuredProduct.price}</div>

              <div className="lookbook-pop-sizes">
                {sizeOptions.map(sz => (
                  <button
                    key={sz}
                    className={`lookbook-size-btn ${selectedSize === sz ? 'is-active' : ''}`}
                    onClick={() => setSelectedSize(sz)}
                  >
                    {sz}
                  </button>
                ))}
              </div>

              <div className="lookbook-pop-actions">
                <button
                  className="btn primary lg full"
                  onClick={() => {
                    addToCart(featuredProduct, selectedSize);
                    setActiveHotspot(false);
                  }}
                >
                  {t('Add to cart', brand.id)}
                </button>
                <Link href={storefrontHref(basePath, `/p/${featuredProduct.slug}`)} className="lookbook-pop-link caption text-center" style={{ display: 'block', marginTop: '8px', textDecoration: 'underline' }}>
                  {t('Go back to shop', brand.id)}
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
