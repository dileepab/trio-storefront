'use client';
import { useState } from 'react';
import Icon from './Icon';
import { useCart } from '@/lib/cartContext';
import { useI18n } from '@/lib/i18n';
import VirtualTryOn from './VirtualTryOn';

export default function PDP({ brand, product }) {
  const availableSizes = Array.isArray(product.sizes) && product.sizes.length > 0
    ? product.sizes
    : ['S', 'M', 'L'];
  const availableColors = Array.isArray(product.colors) ? product.colors : [];
  const defaultSize = availableSizes.includes('M') ? 'M' : availableSizes[0];
  const isSoldOut = typeof product.stockQty === 'number' && product.stockQty <= 0;
  const [size, setSize] = useState(defaultSize);
  const [vtoOpen, setVtoOpen] = useState(false);
  const { addToCart, toggleFavorite, isFavorite } = useCart();
  const { t } = useI18n();

  return (
    <div className="pdp">
      <div className="pdp-img-wrapper" style={{ position: 'relative' }}>
        {product.image ? (
          <img src={product.image} alt={t(product.title, brand)} className="pdp-main-img object-cover w-full h-full" />
        ) : (
          <div className="pdp-img" style={{ background: `linear-gradient(160deg, ${product.swatchA}, ${product.swatchB})` }}>
            <div className="pdp-thumbs">
              <span style={{ background: product.swatchA }}/>
              <span style={{ background: product.swatchB }}/>
              <span style={{ background: `linear-gradient(45deg, ${product.swatchA}, ${product.swatchB})` }}/>
            </div>
          </div>
        )}

        {/* Floating VTO launcher overlay button */}
        <button 
          onClick={() => setVtoOpen(true)} 
          className="vto-launch-btn"
          aria-label="Launch Virtual Try-On"
        >
          👤 {t('Virtual Try-On', brand)}
        </button>
      </div>

      <div className="pdp-body">
        {product.eyebrow && <div className="eyebrow">{t(product.eyebrow, brand)}</div>}
        <h1 className="h1 pdp-title">{t(product.title, brand)}</h1>
        <div className="pdp-price">
          <span className="price">LKR {product.price}</span>
          {product.was && <span className="price-strike">LKR {product.was}</span>}
        </div>
        <div className="pdp-stock"><span className="dot"/> {t(product.stock, brand)}</div>
        <div className="pdp-section">
          <div className="pdp-label">{t('Size', brand)}</div>
          <div className="size-row">
            {availableSizes.map(s => (
              <button key={s} className={`size-pill ${size===s?'is-on':''}`} onClick={() => setSize(s)}>{s}</button>
            ))}
            <button className="link-btn sm">{t('Size chart', brand)}</button>
          </div>
        </div>
        {availableColors.length > 0 && (
          <div className="pdp-section">
            <div className="pdp-label">{t('Color', brand)}</div>
            <div className="size-row">
              {availableColors.map(color => (
                <span key={color} className="chip">{t(color, brand)}</span>
              ))}
            </div>
          </div>
        )}
        <p className="body-sm pdp-desc">{t(product.desc, brand)}</p>
        <div className="pdp-cta">
          <button 
            className="icon-btn-square" 
            aria-label="Save"
            onClick={() => toggleFavorite(product.slug)}
          >
            <Icon name="heart" size={18} fill={isFavorite(product.slug) ? 'var(--brand-primary)' : 'none'}/>
          </button>
          <button 
            className="btn primary lg flex-1"
            disabled={isSoldOut}
            onClick={() => addToCart(product, size)}
          >
            {isSoldOut ? t('Sold out', brand) : t('Add to cart', brand)}
          </button>
          <button className="btn messenger lg" aria-label="Chat"><Icon name="msg" size={18}/></button>
        </div>
      </div>

      {/* VTO Overlay Panel */}
      <VirtualTryOn 
        isOpen={vtoOpen} 
        onClose={() => setVtoOpen(false)} 
        product={product} 
        brandId={brand} 
      />
    </div>
  );
}
