import Link from 'next/link';
import ProductCard from './ProductCard';
import Icon from './Icon';
import { storefrontHref } from '@/lib/storefrontRouting';

export default function CollectionRail({ brand, basePath, title, items }) {
  return (
    <section className="rail">
      <div className="rail-head">
        <h2 className="h2">{title}</h2>
        <Link className="link-btn" href={storefrontHref(basePath, '/shop')}>See all <Icon name="chevron" size={14}/></Link>
      </div>
      <div className="rail-grid">
        {items.map(p => <ProductCard key={p.slug} brand={brand} basePath={basePath} {...p}/>)}
      </div>
    </section>
  );
}
