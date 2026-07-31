'use client';
import { useEffect, useId, useState } from 'react';
import Icon from './Icon';
import { useCart } from '@/lib/cartContext';
import { useI18n } from '@/lib/i18n';
import { usePageContext } from '@/lib/pageContext';
import { colorHex, isPale } from '@/lib/colors';
import { shippingFor } from '@/lib/shipping';
import VirtualTryOn from './VirtualTryOn';

const LOW_STOCK_AT = 5;

export default function PDP({ brand, product }) {
  const availableSizes = Array.isArray(product.sizes) && product.sizes.length > 0
    ? product.sizes
    : ['S', 'M', 'L'];
  const availableColors = Array.isArray(product.colors) ? product.colors : [];
  const defaultSize = availableSizes.includes('M') ? 'M' : availableSizes[0];
  const isSoldOut = typeof product.stockQty === 'number' && product.stockQty <= 0;
  const isLowStock = typeof product.stockQty === 'number'
    && product.stockQty > 0
    && product.stockQty <= LOW_STOCK_AT;

  // Gallery sources: an `images` array when the catalogue supplies one,
  // otherwise the single `image`, otherwise nothing (gradient placeholder).
  const gallery = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : (product.image ? [product.image] : []);

  const [size, setSize] = useState(defaultSize);
  const [color, setColor] = useState(availableColors[0] || null);
  const [activeImage, setActiveImage] = useState(0);
  const [vtoOpen, setVtoOpen] = useState(false);
  const { addToCart, toggleFavorite, isFavorite } = useCart();
  const { t } = useI18n();
  const { setActiveProduct } = usePageContext();

  const uid = useId();
  const sizeLabelId = `${uid}-size`;
  const colorLabelId = `${uid}-color`;

  const shipping = shippingFor(brand, 0);

  // Publish the product the shopper is viewing so the ChatFAB can resolve
  // references like "this item". Clears when leaving the page.
  useEffect(() => {
    setActiveProduct({
      slug: product.slug,
      title: product.title,
      price: product.price,
      was: product.was || null,
      sizes: availableSizes,
      colors: availableColors,
      selectedSize: size,
      selectedColor: color,
      stock: product.stock,
      soldOut: isSoldOut,
      image: product.image || null,
    });
    return () => setActiveProduct(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.slug, size, color]);

  return (
    <div className="pdp">
      <div className="pdp-gallery">
        <div className="pdp-img-wrapper">
          {gallery.length > 0 ? (
            <img
              src={gallery[activeImage]}
              alt={t(product.title, brand)}
              className="pdp-main-img"
            />
          ) : (
            <div className="pdp-img" style={{ background: `linear-gradient(160deg, ${product.swatchA}, ${product.swatchB})` }}>
              <div className="pdp-thumbs">
                <span style={{ background: product.swatchA }}/>
                <span style={{ background: product.swatchB }}/>
                <span style={{ background: `linear-gradient(45deg, ${product.swatchA}, ${product.swatchB})` }}/>
              </div>
            </div>
          )}

          {isSoldOut && (
            <span className="pdp-badge pdp-badge--out">{t('Sold out', brand)}</span>
          )}

          {/* Floating VTO launcher overlay button */}
          <button
            type="button"
            onClick={() => setVtoOpen(true)}
            className="vto-launch-btn"
            aria-label={t('Virtual Try-On', brand)}
          >
            👤 {t('Virtual Try-On', brand)}
          </button>
        </div>

        {gallery.length > 1 && (
          <div className="pdp-thumb-strip" role="group" aria-label={t('Product images', brand)}>
            {gallery.map((src, i) => (
              <button
                type="button"
                key={src}
                className={`pdp-thumb ${i === activeImage ? 'is-on' : ''}`}
                onClick={() => setActiveImage(i)}
                aria-label={`${t('View image', brand)} ${i + 1}`}
                aria-pressed={i === activeImage}
              >
                <img src={src} alt=""/>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="pdp-body">
        {product.eyebrow && <div className="eyebrow">{t(product.eyebrow, brand)}</div>}
        <h1 className="h1 pdp-title">{t(product.title, brand)}</h1>
        <div className="pdp-price">
          <span className="price">LKR {product.price}</span>
          {product.was && <span className="price-strike">LKR {product.was}</span>}
        </div>

        <div className={`pdp-stock${isSoldOut ? ' is-out' : ''}${isLowStock ? ' is-low' : ''}`}>
          <span className="dot"/> {t(product.stock, brand)}
        </div>

        <div className="pdp-section">
          <div className="pdp-label" id={sizeLabelId}>{t('Size', brand)}</div>
          <div className="size-row" role="group" aria-labelledby={sizeLabelId}>
            {availableSizes.map(s => (
              <button
                type="button"
                key={s}
                className={`size-pill ${size === s ? 'is-on' : ''}`}
                onClick={() => setSize(s)}
                aria-pressed={size === s}
              >
                {s}
              </button>
            ))}
            <button type="button" className="link-btn sm">{t('Size chart', brand)}</button>
          </div>
        </div>

        {availableColors.length > 0 && (
          <div className="pdp-section">
            <div className="pdp-label" id={colorLabelId}>
              {t('Color', brand)}
              {color && <span className="pdp-label-value">{t(color, brand)}</span>}
            </div>
            <div className="swatch-row" role="group" aria-labelledby={colorLabelId}>
              {availableColors.map(c => {
                const hex = colorHex(c);
                return (
                  <button
                    type="button"
                    key={c}
                    className={`swatch ${color === c ? 'is-on' : ''} ${isPale(hex) ? 'swatch--pale' : ''}`}
                    onClick={() => setColor(c)}
                    aria-label={t(c, brand)}
                    aria-pressed={color === c}
                    title={t(c, brand)}
                  >
                    <span className="swatch-dot" style={{ background: hex }} aria-hidden="true"/>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <p className="body-sm pdp-desc">{t(product.desc, brand)}</p>

        <div className="pdp-accordion">
          {(product.fabric || product.care) && (
            <details className="pdp-panel">
              <summary className="pdp-panel-head">
                {t('Fabric & care', brand)}
                <Icon name="chevron-d" size={16}/>
              </summary>
              <div className="pdp-panel-body body-sm">
                {product.fabric && <p>{t(product.fabric, brand)}</p>}
                {product.care && <p>{t(product.care, brand)}</p>}
              </div>
            </details>
          )}

          <details className="pdp-panel">
            <summary className="pdp-panel-head">
              {t('Delivery & returns', brand)}
              <Icon name="chevron-d" size={16}/>
            </summary>
            <div className="pdp-panel-body body-sm">
              {shipping.threshold !== null && (
                <p>{t('Free island-wide courier over LKR', brand)} {shipping.threshold.toLocaleString('en-LK')}.</p>
              )}
              <p>{t('Cash on delivery available island-wide.', brand)}</p>
              <p>{t('7-day returns on unworn items with tags attached.', brand)}</p>
            </div>
          </details>
        </div>

        <div className="pdp-cta">
          <button
            type="button"
            className="icon-btn-square"
            aria-label={`${t('Save', brand)} ${t(product.title, brand)}`}
            aria-pressed={isFavorite(product.slug)}
            onClick={() => toggleFavorite(product.slug)}
          >
            <Icon name="heart" size={18} fill={isFavorite(product.slug) ? 'var(--brand-primary)' : 'none'}/>
          </button>
          <button
            type="button"
            className="btn primary lg flex-1"
            disabled={isSoldOut}
            onClick={() => addToCart(product, size, color)}
          >
            {isSoldOut ? t('Sold out', brand) : t('Add to cart', brand)}
          </button>
          <button type="button" className="btn messenger lg" aria-label={t('Chat', brand)}><Icon name="msg" size={18}/></button>
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
