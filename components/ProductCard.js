'use client';
import Link from 'next/link';
import Icon from './Icon';
import { useCart } from '@/lib/cartContext';

export default function ProductCard({ brand, slug, title, price, was, tag, swatchA, swatchB, eyebrow, rating, image }) {
  const { toggleFavorite, isFavorite } = useCart();
  const favorited = isFavorite(slug);

  const formatText = (text) => {
    return brand === 'modabella' ? text.toLowerCase() : text;
  };

  return (
    <Link href={`/${brand}/p/${slug}`} className={`p-card p-card--${brand}`}>
      <div className="p-img" style={{ background: image ? 'var(--brand-surface-2)' : `linear-gradient(160deg, ${swatchA} 0%, ${swatchB} 100%)` }}>
        {image && (
          <img 
            src={image} 
            alt={title} 
            className="object-cover w-full h-full" 
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', transition: 'transform var(--dur-slow) var(--ease-out)' }} 
          />
        )}
        {tag && <span className="p-tag">{formatText(tag.label)}</span>}
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
