import { getBrand } from '@/lib/brands';
import { getProducts } from '@/lib/products';
import LookbookPageClient from '@/components/LookbookPageClient';

export default async function LookbookPage({ params }) {
  const brand = getBrand(params.brand);
  if (!brand) return null;

  const products = await getProducts(brand.id);

  return <LookbookPageClient brand={brand} products={products}/>;
}
