export const DOMAIN_BRANDS = {
  'happybuyfashion.com': 'happybuy',
  'www.happybuyfashion.com': 'happybuy',
  'lovemodabella.com': 'modabella',
  'www.lovemodabella.com': 'modabella',
  'cleopatraforever.com': 'cleopatra',
  'www.cleopatraforever.com': 'cleopatra',
};

export function normalizeHost(host) {
  return host?.split(':')[0]?.toLowerCase() || '';
}

export function getBrandForHost(host) {
  return DOMAIN_BRANDS[normalizeHost(host)] || null;
}

export function getStorefrontBasePath(brandId, host) {
  return getBrandForHost(host) === brandId ? '' : `/${brandId}`;
}

export function storefrontHref(basePath, path = '') {
  const cleanBase = basePath === '/' ? '' : basePath;
  const cleanPath = path ? `/${String(path).replace(/^\/+/, '')}` : '';
  return `${cleanBase}${cleanPath}` || '/';
}
