'use client';
import Link from 'next/link';
import Icon from './Icon';
import { useCart } from '@/lib/cartContext';
import { storefrontHref } from '@/lib/storefrontRouting';
import { sortSizes } from '@/lib/products';

// Below this many units we nudge the shopper rather than staying silent
const LOW_STOCK_AT = 5;

export default function ProductCard({
  brand, basePath, slug, title, price, was, tag,
  swatchA, swatchB, eyebrow, rating, image, sizes, stockQty,
  // The grid's place in the heading outline differs by page: on the PLP the
  // cards sit directly under the page <h1>, on the home page they sit under a
  // rail's <h2>. Skipping a level is a structural error either way.
  headingLevel = 3,
}) {
  const Heading = `h${headingLevel}`;
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

  const displaySizes = sortSizes(Array.isArray(sizes) && sizes.length > 0 ? sizes : ['S', 'M', 'L']);

  return (
    /* The card is a container, not a link. The title holds the only anchor and
       stretches an invisible ::after over the whole card for the click target,
       so the save and quick-add buttons are siblings of that link rather than
       interactive elements nested inside it — which is invalid HTML and left
       the card's accessible name as the whole card's text run together. */
    <article className={`p-card p-card--${brand}${soldOut ? ' is-sold-out' : ''}`}>
      <div
        className="p-img"
        style={{ background: image ? 'var(--brand-surface-2)' : `linear-gradient(160deg, ${swatchA} 0%, ${swatchB} 100%)` }}
      >
        {/* alt="" — the title link directly below names the product, so a
            description here would just be announced twice. */}
        {image && <img src={image} alt="" className="p-card-img"/>}

        {/* Real element rather than a filter on .p-img — a parent filter would
            drag the status badge down with it. */}
        {soldOut && <span className="p-sold-scrim" aria-hidden="true"/>}

        {tag && !soldOut && <span className="p-tag">{formatText(tag.label)}</span>}

        {soldOut && <span className="p-stock p-stock--out">{formatText('Sold out')}</span>}
        {lowStock && <span className="p-stock p-stock--low">{formatText(`Only ${stockQty} left`)}</span>}

        <button
          type="button"
          className="p-fav"
          onClick={() => toggleFavorite(slug)}
          aria-label={`${formatText('Save')} ${formatText(title)}`}
          aria-pressed={favorited}
        >
          <Icon name="heart" size={16} fill={favorited ? 'var(--brand-primary)' : 'none'}/>
        </button>

        {/* Quick Add Overlay — withheld entirely when there is nothing to add */}
        {!soldOut && (
          <div className="p-quick-add">
            <div className="p-quick-add-title" aria-hidden="true">{formatText('Quick Add')}</div>
            <div className="p-quick-add-sizes">
              {displaySizes.map(size => (
                <button
                  type="button"
                  key={size}
                  className="p-quick-add-btn"
                  /* The visible label is just "S" — on its own that tells a
                     screen reader nothing about what is being added. */
                  aria-label={`${formatText('Add')} ${formatText(title)}, ${formatText('size')} ${size}`}
                  onClick={() => addToCart({ slug, title, price, swatchA, swatchB, image }, size)}
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
        <Heading className="p-title">
          <Link
            href={storefrontHref(basePath, `/p/${slug}`)}
            className="p-title-link"
          >
            {formatText(title)}
          </Link>
        </Heading>

        {/* Available Sizes Indicator */}
        {displaySizes.length > 0 && (
          <div className="p-sizes-badge">
            <span className="p-sizes-label">{formatText('Sizes')}: </span>
            <span className="p-sizes-list">
              {displaySizes.map((s, idx) => (
                <span key={s} className="p-size-tag">
                  {s}{idx < displaySizes.length - 1 ? ' · ' : ''}
                </span>
              ))}
            </span>
          </div>
        )}

        <div className="p-meta">
          <div className="price">
            {was && <span className="price-strike">LKR {was}</span>}
            LKR {price}
          </div>
          {rating && (
            <div className="p-rating">
              <Icon name="star" size={12}/>
              <span className="visually-hidden">{formatText('Rated')}</span> {rating}
              <span className="visually-hidden"> {formatText('out of 5')}</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
