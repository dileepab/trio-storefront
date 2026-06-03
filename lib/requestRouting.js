import { headers } from 'next/headers';
import { getStorefrontBasePath } from './storefrontRouting';

export function getRequestBasePath(brandId) {
  return getStorefrontBasePath(brandId, headers().get('host'));
}
