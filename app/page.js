import Link from 'next/link';
import { BRANDS, BRAND_SLUGS } from '@/lib/brands';

export const metadata = { title: 'Trio · Pick a brand' };

export default function Index() {
  return (
    <main className="trio-portal">
      <div className="trio-portal-inner">
        <div className="trio-eyebrow">TRIO</div>
        <h1 className="trio-title">Three brands.<br/>One platform.</h1>
        <p className="trio-sub">Pick a storefront to enter.</p>
        <div className="trio-grid">
          {BRAND_SLUGS.map(slug => {
            const b = BRANDS[slug];
            return (
              <Link key={slug} href={`/${slug}`} className={`trio-card trio-card--${slug}`} data-brand={slug}>
                <div className="trio-card-mark">
                  <img src={`/logos/${slug}.svg`} alt={b.name}/>
                </div>
                <div className="trio-card-name">{b.name}</div>
                <div className="trio-card-domain">{b.domain}</div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
