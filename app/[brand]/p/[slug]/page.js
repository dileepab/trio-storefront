import { getBrand } from '@/lib/brands';
import { getProduct } from '@/lib/products';
import { notFound } from 'next/navigation';
import PDP from '@/components/PDP';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  // optional — enables build-time generation
  return [];
}

export default async function ProductPage({ params }) {
  const brand = getBrand(params.brand);
  if (!brand) return null;
  const product = await getProduct(brand.id, params.slug);
  if (!product) notFound();
  return (
    <main>
      <PDP brand={brand.id} product={product}/>
    </main>
  );
}
