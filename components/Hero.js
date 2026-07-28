import Link from 'next/link';
import Icon from './Icon';
import { storefrontHref } from '@/lib/storefrontRouting';

export default function Hero({ data, basePath }) {
  return (
    <section className="hero">
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
