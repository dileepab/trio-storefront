export const BRANDS = {
  happybuy: {
    id: 'happybuy',
    name: 'Happy Buy',
    domain: 'happybuyfashion.com',
    nav: ['New', 'Deals', 'Men', 'Women', 'Kids', 'Home'],
    voice: { lower: false, exclaim: true },
  },
  cleopatra: {
    id: 'cleopatra',
    name: 'Cleopatra',
    domain: 'cleopatraforever.com',
    nav: ['Bridal', 'Sarees', 'Lehengas', 'Heritage', 'Atelier'],
    voice: { lower: false, exclaim: false },
  },
  modabella: {
    id: 'modabella',
    name: 'modabella',
    domain: 'lovemodabella.com',
    nav: ['new', 'fall edit', 'tailoring', 'knitwear', 'sale', 'about'],
    voice: { lower: true, exclaim: false },
  },
};

export function getBrand(slug) {
  return BRANDS[slug] || null;
}

export const BRAND_SLUGS = Object.keys(BRANDS);
