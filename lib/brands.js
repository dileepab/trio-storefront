export const BRANDS = {
  happybuy: {
    id: 'happybuy',
    name: 'Happy Buy',
    domain: 'happybuy.lk',
    nav: ['New', 'Deals', 'Men', 'Women', 'Kids', 'Home'],
    voice: { lower: false, exclaim: true },
  },
  cleopatra: {
    id: 'cleopatra',
    name: 'Cleopatra',
    domain: 'cleopatra.lk',
    nav: ['Bridal', 'Sarees', 'Lehengas', 'Heritage', 'Atelier'],
    voice: { lower: false, exclaim: false },
  },
  modabella: {
    id: 'modabella',
    name: 'modabella',
    domain: 'modabella.lk',
    nav: ['new', 'fall edit', 'tailoring', 'knitwear', 'sale', 'about'],
    voice: { lower: true, exclaim: false },
  },
};

export function getBrand(slug) {
  return BRANDS[slug] || null;
}

export const BRAND_SLUGS = Object.keys(BRANDS);
