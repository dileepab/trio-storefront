export const BRANDS = {
  happybuy: {
    id: 'happybuy',
    name: 'Happy Buy',
    domain: 'happybuyfashion.com',
    logo: '/logos/happybuy.svg',
    nav: ['New', 'Deals', 'Men', 'Women', 'Kids', 'Home'],
    voice: { lower: false, exclaim: true },
    freeShippingOver: 7000,
  },
  cleopatra: {
    id: 'cleopatra',
    name: 'Cleopatra',
    domain: 'cleopatraforever.com',
    logo: '/logos/cleopatra.svg',
    nav: ['Bridal', 'Sarees', 'Lehengas', 'Heritage', 'Atelier'],
    voice: { lower: false, exclaim: false },
    freeShippingOver: 50000,
  },
  modabella: {
    id: 'modabella',
    name: 'modabella',
    domain: 'lovemodabella.com',
    logo: '/logos/modabella.svg',
    nav: ['new', 'fall edit', 'tailoring', 'knitwear', 'sale', 'about'],
    voice: { lower: true, exclaim: false },
    freeShippingOver: 8000,
  },
};

export function getBrand(slug) {
  return BRANDS[slug] || null;
}

// Applies a brand's casing rule (Modabella writes in lowercase throughout).
export function brandVoice(brandId, text) {
  return BRANDS[brandId]?.voice?.lower ? String(text).toLowerCase() : text;
}

export const BRAND_SLUGS = Object.keys(BRANDS);
