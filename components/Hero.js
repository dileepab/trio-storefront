import Link from 'next/link';
import Icon from './Icon';
import { storefrontHref } from '@/lib/storefrontRouting';

export default function Hero({ brand, data, basePath }) {
  if (!data) return null;

  return (
    <section className={`hero hero--${brand || 'default'}`}>
      <div className="hero-inner">
        <div className="hero-content">
          {data.eyebrow && (
            <div className="hero-badge-wrapper">
              <span className="hero-badge">
                <span className="hero-pulse-dot" aria-hidden="true" />
                {data.eyebrow}
              </span>
            </div>
          )}
          <h1 className="h-display hero-title">{data.title}</h1>
          <p className="hero-sub">{data.sub}</p>
          
          <div className="hero-actions">
            <Link href={storefrontHref(basePath, '/shop')} className="btn primary lg hero-cta">
              {data.cta} <Icon name="chevron" size={16}/>
            </Link>
            {data.secondaryCta && (
              <Link href={storefrontHref(basePath, '/lookbook')} className="btn outline lg hero-secondary-cta">
                {data.secondaryCta}
              </Link>
            )}
          </div>

          <div className="hero-trust-bar">
            <span className="hero-trust-item">⚡ Fast Delivery</span>
            <span className="hero-trust-dot">•</span>
            <span className="hero-trust-item">💵 Cash on Delivery</span>
            <span className="hero-trust-dot">•</span>
            <span className="hero-trust-item">🔄 Easy 7-Day Returns</span>
          </div>
        </div>

        {data.bannerImage && (
          <div className="hero-visual">
            <div className="hero-visual-card">
              <img src={data.bannerImage} alt={data.title} className="hero-banner-img" />
              {data.badgeText && (
                <div className="hero-floating-badge">
                  <span className="hero-floating-tag">OFFER</span>
                  <span className="hero-floating-text">{data.badgeText}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

