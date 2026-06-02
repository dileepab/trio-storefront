// Mock product catalog. Used as a design fallback when PLATFORM_API_BASE_URL is not set.

const MOCK_PRODUCTS = {
  happybuy: [
    { slug: 'cotton-crew-tee', title: 'Cotton Crew Tee · Sunshine', price: '2,090', was: '2,990', tag: { label: '−30%' }, swatchA: '#F4C95D', swatchB: '#D94B26', rating: '4.6', desc: '100% cotton. Pre-shrunk. Wash cold, hang dry.', stock: 'In stock — ships in 1 day', image: '/images/products/happybuy_crew_tee.png' },
    { slug: 'slim-fit-denim', title: 'Slim-Fit Denim · Indigo', price: '4,490', tag: { label: 'New' }, swatchA: '#2E6F8E', swatchB: '#1F1A14', rating: '4.4', desc: '12 oz mid-stretch denim with a slim leg.', stock: 'In stock' },
    { slug: 'knit-polo-olive', title: 'Knit Polo · Olive', price: '3,290', swatchA: '#9DB09A', swatchB: '#5A6450', rating: '4.5', desc: 'Lightweight knit polo, all-day breathable.', stock: 'In stock' },
    { slug: 'linen-shorts-tan', title: 'Linen Shorts · Tan', price: '2,690', was: '3,390', tag: { label: '−20%' }, swatchA: '#D9A899', swatchB: '#B8762B', rating: '4.3', desc: '100% linen. Drawstring waist.', stock: 'In stock' },
  ],
  cleopatra: [
    { slug: 'royal-indigo-saree', title: 'Hand-finished Saree · Royal Indigo', price: '48,500', eyebrow: 'Heirloom · Kandy', swatchA: '#2A2118', swatchB: '#6B3A2E', desc: 'Pure silk with hand-block prints. Includes matching blouse fabric.', stock: 'Made-to-order — 5 days', image: '/images/products/cleopatra_royal_saree.png' },
    { slug: 'garnet-lehenga', title: 'Garnet Lehenga', price: '62,000', eyebrow: 'Festive', swatchA: '#6B3A2E', swatchB: '#2A2118', desc: 'Three-piece lehenga with hand embroidery.', stock: 'In stock' },
    { slug: 'ivory-kandyan-set', title: 'Ivory Kandyan Set', price: '54,000', eyebrow: 'Heritage', swatchA: '#F2E9D6', swatchB: '#A07A3A', desc: 'Traditional Kandyan attire, hand-woven.', stock: 'Made-to-order — 7 days' },
    { slug: 'emerald-silk-saree', title: 'Emerald Silk Saree', price: '52,500', eyebrow: 'New', swatchA: '#2E3B36', swatchB: '#2A2118', desc: 'Silk with gold zari border.', stock: 'In stock' },
  ],
  modabella: [
    { slug: 'linen-blazer-cream', title: 'linen blazer · cream', price: '12,800', tag: { label: 'new' }, swatchA: '#ECE5D8', swatchB: '#D9A899', desc: 'Belgian linen, lightly structured. Falls just past the hip.', stock: 'in stock', image: '/images/products/modabella_linen_blazer.png' },
    { slug: 'wide-leg-trouser-sage', title: 'wide-leg trouser · sage', price: '8,500', swatchA: '#ECE5D8', swatchB: '#9DB09A', desc: 'wide-leg cotton trouser with a soft drape.', stock: 'in stock' },
    { slug: 'silk-camisole-ink', title: 'silk camisole · ink', price: '6,400', swatchA: '#3A332C', swatchB: '#5A4F45', desc: 'pure silk camisole. wash cold.', stock: 'in stock' },
    { slug: 'wool-overshirt-oat', title: 'wool overshirt · oat', price: '14,200', tag: { label: 'new' }, swatchA: '#ECE5D8', swatchB: '#C9B89D', desc: 'merino wool overshirt — fall through winter.', stock: 'in stock' },
  ],
};

export const RAIL_TITLES = {
  happybuy: 'Top picks · weekend deals',
  cleopatra: 'Bridal · ’26',
  modabella: 'fall edit · 24 pieces',
};

export const HERO = {
  happybuy: { eyebrow: 'WEEKEND DEALS', title: 'Big sizes, small prices.', sub: 'Up to 40% off, ends Sunday.', cta: 'Shop the deals', tone: '#F4C95D', tone2: '#D94B26' },
  cleopatra: { eyebrow: 'BRIDAL ’26', title: 'For the ceremonies\nthat matter.', sub: 'Hand-finished sarees & lehengas, made in Kandy.', cta: 'View the collection', tone: '#F2E9D6', tone2: '#A07A3A' },
  modabella: { eyebrow: 'FALL EDIT', title: 'considered tailoring,\neveryday.', sub: '24 pieces. linen, wool, cotton.', cta: 'see the edit', tone: '#D9A899', tone2: '#9DB09A' },
};

const BRAND_TO_PLATFORM_QUERY = {
  happybuy: 'Happyby',
  cleopatra: 'Cleopatra',
  modabella: 'Modabella',
};

function priceNumber(product) {
  if (typeof product.priceNumber === 'number') {
    return product.priceNumber;
  }

  return Number.parseInt(String(product.price || '0').replace(/,/g, ''), 10) || 0;
}

function normalizeProduct(product) {
  return {
    ...product,
    priceNumber: priceNumber(product),
    sizes: Array.isArray(product.sizes) && product.sizes.length > 0
      ? product.sizes
      : ['S', 'M', 'L'],
    colors: Array.isArray(product.colors) ? product.colors : [],
    variants: Array.isArray(product.variants) ? product.variants : [],
    stockQty: typeof product.stockQty === 'number'
      ? product.stockQty
      : null,
  };
}

function platformApiBaseUrl() {
  return (
    process.env.PLATFORM_API_BASE_URL ||
    process.env.NEXT_PUBLIC_PLATFORM_API_BASE_URL ||
    ''
  ).replace(/\/+$/, '');
}

async function fetchPlatformProducts(brand) {
  const baseUrl = platformApiBaseUrl();
  const platformBrand = BRAND_TO_PLATFORM_QUERY[brand];

  if (!baseUrl || !platformBrand) {
    return null;
  }

  try {
    const response = await fetch(
      `${baseUrl}/api/storefront/products?brand=${encodeURIComponent(platformBrand)}`,
      { next: { revalidate: 60 } }
    );

    if (!response.ok) {
      return null;
    }

    const payload = await response.json();
    const products = payload?.data?.products;
    return Array.isArray(products) ? products.map(normalizeProduct) : null;
  } catch {
    return null;
  }
}

export async function getProducts(brand) {
  const platformProducts = await fetchPlatformProducts(brand);

  if (platformProducts && platformProducts.length > 0) {
    return platformProducts;
  }

  return (MOCK_PRODUCTS[brand] || []).map(normalizeProduct);
}

export async function getProduct(brand, slug) {
  const products = await getProducts(brand);
  return products.find(p => p.slug === slug) || null;
}
