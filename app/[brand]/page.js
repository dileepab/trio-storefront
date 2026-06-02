import { getBrand } from '@/lib/brands';
import { getProducts, HERO, RAIL_TITLES } from '@/lib/products';
import Hero from '@/components/Hero';
import TrustStrip from '@/components/TrustStrip';
import CollectionRail from '@/components/CollectionRail';

export default async function BrandHome({ params }) {
  const brand = getBrand(params.brand);
  if (!brand) return null;
  const products = await getProducts(brand.id);
  return (
    <main>
      <Hero brand={brand.id} data={HERO[brand.id]}/>
      <TrustStrip brand={brand.id}/>
      <CollectionRail brand={brand.id} title={RAIL_TITLES[brand.id]} items={products}/>
    </main>
  );
}
