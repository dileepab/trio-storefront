'use client';
import { getBrand } from '@/lib/brands';
import Cart from '@/components/Cart';
import { useParams } from 'next/navigation';

export default function CartPage() {
  const params = useParams();
  const brand = getBrand(params.brand);
  if (!brand) return null;
  return (
    <main>
      <Cart brand={brand.id}/>
    </main>
  );
}
