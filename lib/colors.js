// Catalogue colour names -> swatch hex. Shared by the PLP filter panel and the
// PDP colour selector so the two never drift apart.
export const COLOR_HEX = {
  Beige: '#D9A899',
  Black: '#1F1A14',
  Blue: '#2E6F8E',
  Champagne: '#C9B89D',
  Charcoal: '#3A332C',
  Coral: '#D94B26',
  Cream: '#ECE5D8',
  Emerald: '#2E3B36',
  Navy: '#2A2118',
  Orange: '#D94B26',
  Pink: '#D9A899',
  Red: '#6B3A2E',
  Sage: '#9DB09A',
  Stone: '#C9B89D',
  White: '#F2E9D6',
  Wine: '#6B3A2E',
  Yellow: '#F4C95D',
};

// Swatches too pale to read against a light panel without an outline
export const PALE_SWATCHES = new Set(['#ECE5D8', '#F2E9D6', '#C9B89D']);

export function colorHex(name) {
  return COLOR_HEX[name] || 'var(--brand-primary)';
}

export function isPale(hex) {
  return PALE_SWATCHES.has(hex);
}
