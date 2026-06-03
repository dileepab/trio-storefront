import { getBrand, BRAND_SLUGS } from '@/lib/brands';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChatFAB from '@/components/ChatFAB';
import CartDrawer from '@/components/CartDrawer';
import { CartProvider } from '@/lib/cartContext';
import { AuthProvider } from '@/lib/authContext';
import { I18nProvider } from '@/lib/i18n';

export async function generateStaticParams() {
  return BRAND_SLUGS.map(brand => ({ brand }));
}

export async function generateMetadata({ params }) {
  const b = getBrand(params.brand);
  return { title: b ? `${b.name} · ${b.domain}` : 'Not found' };
}

export default function BrandLayout({ children, params }) {
  const brand = getBrand(params.brand);
  if (!brand) notFound();
  return (
    <I18nProvider>
      <AuthProvider brandId={brand.id}>
        <CartProvider brandId={brand.id}>
          <div data-brand={brand.id} className="brand-root">
            <Header brand={brand}/>
            {children}
            <Footer brand={brand}/>
            <ChatFAB brand={brand}/>
            <CartDrawer brand={brand}/>
          </div>
        </CartProvider>
      </AuthProvider>
    </I18nProvider>
  );
}
