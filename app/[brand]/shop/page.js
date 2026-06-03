import { getBrand } from '@/lib/brands';
import { getProducts } from '@/lib/products';
import ShopPageClient from '@/components/ShopPageClient';
import { getRequestBasePath } from '@/lib/requestRouting';

export default async function ShopPage({ params }) {
  const brand = getBrand(params.brand);
  if (!brand) return null;

  const products = await getProducts(brand.id);
  const basePath = getRequestBasePath(brand.id);

  return <ShopPageClient brand={brand} products={products} basePath={basePath}/>;
}
