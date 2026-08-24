import { BRANDS } from './brands';

// Flat courier rate, previously duplicated as a literal in Cart and CartDrawer.
// Must match DELIVERY_FEE_LKR on the platform: the cart shows this number and
// the platform charges it, so they cannot drift apart.
export const DELIVERY_FEE = 425;

export function freeShippingThreshold(brandId) {
  const value = BRANDS[brandId]?.freeShippingOver;
  return typeof value === 'number' ? value : null;
}

/**
 * Delivery cost plus everything the progress bar needs to render.
 * `progress` is 0..1; `remaining` is what the shopper must still add.
 */
/**
 * @param rule the brand's rule from the platform. The local constants are a
 *   fallback for when the platform cannot be reached, not a second source of
 *   truth — the platform is what the courier collects on.
 */
export function shippingFor(brandId, subtotal, rule = null) {
  const threshold = typeof rule?.freeOver === 'number' ? rule.freeOver : freeShippingThreshold(brandId);
  const fee = typeof rule?.flatFee === 'number' ? rule.flatFee : DELIVERY_FEE;

  if (subtotal <= 0) {
    return { fee: 0, threshold, remaining: threshold || 0, qualified: false, progress: 0 };
  }

  const qualified = threshold !== null && subtotal >= threshold;

  return {
    fee: qualified ? 0 : fee,
    threshold,
    remaining: threshold === null ? 0 : Math.max(0, threshold - subtotal),
    qualified,
    progress: threshold === null ? 0 : Math.min(1, subtotal / threshold),
  };
}
