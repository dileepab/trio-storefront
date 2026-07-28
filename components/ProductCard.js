'use client';
import Link from 'next/link';
import Icon from './Icon';
import { useCart } from '@/lib/cartContext';
import { storefrontHref } from '@/lib/storefrontRouting';

// Below this many units we nudge the shopper rather than staying silent
const LOW_STOCK_AT = 5;

export default function ProductCard({
  brand, basePath, slug, title, price, was, tag,
  swatchA, swatchB, eyebrow, rating, image, sizes, stockQty,
}) {
  const { toggleFavorite, isFavorite, addToCart } = useCart();
  const favorited = isFavorite(slug);

  const formatText = (text) => {
    return brand === 'modabella' ? text.toLowerCase() : text;
  };

  // stockQty is null when the catalogue does not report inventory — in that
  // case we show no badge at all rather than implying availability.
  const tracked = typeof stockQty === 'number';
  const soldOut = tracked && stockQty <= 0;
  const lowStock = tracked && stockQty > 0 && stockQty <= LOW_STOCK_AT;

  const quickSizes = (Array.isArray(sizes) && sizes.length > 0 ? sizes : ['S', 'M', 'L']).slice(0, 3);

  return (
    <Link
      href={storefrontHref(basePath, `/p/${slug}`)}
      className={`p-card p-card--${brand}${soldOut ? ' is-sold-out' : ''}`}
    >
      <div
        className="p-img"
        style={{ background: image ? 'var(--brand-surface-2)' : `linear-gradient(160deg, ${swatchA} 0%, ${swatchB} 100%)` }}
      >
        {image && <img src={image} alt={title} className="p-card-img"/>}

        {/* Real element rather than a filter on .p-img — a parent filter would
            drag the status badge down with it. */}
        {soldOut && <span className="p-sold-scrim" aria-hidden="true"/>}

        {tag && !soldOut && <span className="p-tag">{formatText(tag.label)}</span>}

        {soldOut && <span className="p-stock p-stock--out">{formatText('Sold out')}</span>}
        {lowStock && <span className="p-stock p-stock--low">{formatText(`Only ${stockQty} left`)}</span>}

        <button
          className="p-fav"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(slug);
          }}
          aria-label="Save"
          style={{ border: 0 }}
        >
          <Icon name="heart" size={16} fill={favorited ? 'var(--brand-primary)' : 'none'}/>
        </button>

        {/* Quick Add Overlay — withheld entirely when there is nothing to add */}
        {!soldOut && (
          <div className="p-quick-add">
            <div className="p-quick-add-title">{formatText('Quick Add')}</div>
            <div className="p-quick-add-sizes">
              {quickSizes.map(size => (
                <button
                  key={size}
                  className="p-quick-add-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    addToCart({ slug, title, price, swatchA, swatchB, image }, size);
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="p-body">
        {eyebrow && <div className="eyebrow p-eyebrow">{formatText(eyebrow)}</div>}
        <div className="p-title">{formatText(title)}</div>
        <div className="p-meta">
          <div className="price">
            {was && <span className="price-strike">LKR {was}</span>}
            LKR {price}
          </div>
          {rating && <div className="p-rating"><Icon name="star" size={12}/> {rating}</div>}
        </div>
      </div>
    </Link>
  );
}
