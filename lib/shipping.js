import { BRANDS } from './brands';

// Flat courier rate, previously duplicated as a literal in Cart and CartDrawer.
export const DELIVERY_FEE = 350;

export function freeShippingThreshold(brandId) {
  const value = BRANDS[brandId]?.freeShippingOver;
  return typeof value === 'number' ? value : null;
}

/**
 * Delivery cost plus everything the progress bar needs to render.
 * `progress` is 0..1; `remaining` is what the shopper must still add.
 */
export function shippingFor(brandId, subtotal) {
  const threshold = freeShippingThreshold(brandId);

  if (subtotal <= 0) {
    return { fee: 0, threshold, remaining: threshold || 0, qualified: false, progress: 0 };
  }

  const qualified = threshold !== null && subtotal >= threshold;

  return {
    fee: qualified ? 0 : DELIVERY_FEE,
    threshold,
    remaining: threshold === null ? 0 : Math.max(0, threshold - subtotal),
    qualified,
    progress: threshold === null ? 0 : Math.min(1, subtotal / threshold),
  };
}
