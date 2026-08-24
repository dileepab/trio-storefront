'use client';

/**
 * The shopping events Meta needs to find buyers rather than browsers.
 *
 * Every call is a no-op when the pixel is not configured, so the site works
 * exactly as before without it.
 */

function track(event, data, options) {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;
  window.fbq('track', event, data, options);
}

export function trackViewContent({ id, title, price }) {
  track('ViewContent', {
    content_ids: [String(id)],
    content_name: title,
    content_type: 'product',
    value: price,
    currency: 'LKR',
  });
}

export function trackAddToCart({ id, title, price, quantity = 1 }) {
  track('AddToCart', {
    content_ids: [String(id)],
    content_name: title,
    content_type: 'product',
    contents: [{ id: String(id), quantity }],
    value: price * quantity,
    currency: 'LKR',
  });
}

export function trackInitiateCheckout({ items, value }) {
  track('InitiateCheckout', {
    content_ids: items.map((item) => String(item.productId ?? item.slug)),
    contents: items.map((item) => ({ id: String(item.productId ?? item.slug), quantity: item.qty })),
    num_items: items.reduce((total, item) => total + item.qty, 0),
    value,
    currency: 'LKR',
  });
}

export function trackPurchase({ orderId, items, value }) {
  track(
    'Purchase',
    {
      content_ids: items.map((item) => String(item.productId ?? item.slug)),
      contents: items.map((item) => ({ id: String(item.productId ?? item.slug), quantity: item.qty })),
      num_items: items.reduce((total, item) => total + item.qty, 0),
      value,
      currency: 'LKR',
    },
    // The platform reports the same sale from the server under this id. Meta
    // deduplicates on it, so a sale counts once rather than twice.
    { eventID: `order-${orderId}` }
  );
}
