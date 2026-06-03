import { getBrand } from '@/lib/brands';
import Cart from '@/components/Cart';
import { getRequestBasePath } from '@/lib/requestRouting';

export default function CartPage({ params }) {
  const brand = getBrand(params.brand);
  if (!brand) return null;
  const basePath = getRequestBasePath(brand.id);
  return (
    <main>
      <Cart brand={brand.id} basePath={basePath}/>
    </main>
  );
}
