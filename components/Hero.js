import Link from 'next/link';
import Icon from './Icon';
import { storefrontHref } from '@/lib/storefrontRouting';

export default function Hero({ brand, data, basePath }) {
  return (
    <section className="hero" style={{ background: `linear-gradient(160deg, ${data.tone} 0%, ${data.tone2} 100%)` }}>
      <div className="hero-inner">
        <div className="eyebrow">{data.eyebrow}</div>
        <h1 className="h-display hero-title">{data.title}</h1>
        <p className="hero-sub">{data.sub}</p>
        <Link href={storefrontHref(basePath, '/shop')} className="btn primary lg">{data.cta} <Icon name="chevron" size={16}/></Link>
      </div>
    </section>
  );
}
