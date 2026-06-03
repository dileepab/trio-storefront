export const BRANDS = {
  happybuy: {
    id: 'happybuy',
    name: 'Happy Buy',
    domain: 'happybuyfashion.com',
    logo: '/logos/happybuy.svg',
    nav: ['New', 'Deals', 'Men', 'Women', 'Kids', 'Home'],
    voice: { lower: false, exclaim: true },
  },
  cleopatra: {
    id: 'cleopatra',
    name: 'Cleopatra',
    domain: 'cleopatraforever.com',
    logo: '/logos/cleopatra.svg',
    nav: ['Bridal', 'Sarees', 'Lehengas', 'Heritage', 'Atelier'],
    voice: { lower: false, exclaim: false },
  },
  modabella: {
    id: 'modabella',
    name: 'modabella',
    domain: 'lovemodabella.com',
    logo: '/logos/modabella.jpg',
    nav: ['new', 'fall edit', 'tailoring', 'knitwear', 'sale', 'about'],
    voice: { lower: true, exclaim: false },
  },
};

export function getBrand(slug) {
  return BRANDS[slug] || null;
}

export const BRAND_SLUGS = Object.keys(BRANDS);
