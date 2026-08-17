import Link from 'next/link';
import Icon from './Icon';
import { storefrontHref } from '@/lib/storefrontRouting';

export default function Hero({ brand, data, basePath }) {
  if (!data) return null;
  const hasImage = Boolean(data.image);

  return (
    <section
      className={`hero ${hasImage ? 'hero--with-image' : ''}`}
      data-has-image={hasImage ? 'true' : undefined}
    >
      {hasImage && (
        <div className="hero-backdrop" aria-hidden="true">
          <img
            src={data.image}
            alt=""
            className="hero-backdrop-img"
            fetchPriority="high"
            loading="eager"
            decoding="async"
          />
          <div className="hero-backdrop-scrim" />
        </div>
      )}
      <div className="hero-inner">
        {data.eyebrow && <span className="hero-badge">{data.eyebrow}</span>}
        <h1 className="h-display hero-title">{data.title}</h1>
        <p className="hero-sub">{data.sub}</p>
        <Link href={storefrontHref(basePath, '/shop')} className="btn primary lg hero-cta">
          {data.cta} <Icon name="chevron" size={16}/>
        </Link>
      </div>
    </section>
  );
}

