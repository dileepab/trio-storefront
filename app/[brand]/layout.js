import { getBrand, BRAND_SLUGS } from '@/lib/brands';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChatFAB from '@/components/ChatFAB';
import CartDrawer from '@/components/CartDrawer';
import MetaPixel from '@/components/MetaPixel';
import { CartProvider } from '@/lib/cartContext';
import { AuthProvider } from '@/lib/authContext';
import { I18nProvider } from '@/lib/i18n';
import { PageContextProvider } from '@/lib/pageContext';
import { AnnouncerProvider } from '@/lib/announcer';
import { getRequestBasePath } from '@/lib/requestRouting';

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
  const basePath = getRequestBasePath(brand.id);
  return (
    <I18nProvider>
      <AuthProvider brandId={brand.id}>
        <CartProvider brandId={brand.id}>
          <PageContextProvider>
            <AnnouncerProvider>
              <MetaPixel />
              <div data-brand={brand.id} className="brand-root">
                {/* Every page repeats the header and its nav; this gives
                    keyboard and switch users one keystroke past it. */}
                <a href="#main-content" className="skip-link">Skip to content</a>
                <Header brand={brand} basePath={basePath}/>
                <div id="main-content" tabIndex={-1}>
                  {children}
                </div>
                <Footer brand={brand}/>
                <ChatFAB brand={brand}/>
                <CartDrawer brand={brand}/>
              </div>
            </AnnouncerProvider>
          </PageContextProvider>
        </CartProvider>
      </AuthProvider>
    </I18nProvider>
  );
}
