import { NextResponse } from 'next/server';

/**
 * Forwards a checkout to the platform, the same way chat is forwarded.
 *
 * The browser talks to this site and this site talks to the platform, so the
 * platform's address never reaches the client bundle and no cross-origin
 * request is involved.
 */

function platformApiBaseUrl() {
  return (
    process.env.PLATFORM_API_BASE_URL ||
    process.env.NEXT_PUBLIC_PLATFORM_API_BASE_URL ||
    ''
  ).replace(/\/+$/, '');
}

export async function POST(request) {
  const baseUrl = platformApiBaseUrl();

  if (!baseUrl) {
    return NextResponse.json(
      { success: false, error: 'Ordering is unavailable right now. Please message us.' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const response = await fetch(`${baseUrl}/api/storefront/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Proves the order came from this site. Without it anyone could post
        // cash-on-delivery orders straight to the platform, and every one of
        // them costs real packing and courier work to discover.
        ...(process.env.STOREFRONT_API_KEY
          ? { 'x-storefront-key': process.env.STOREFRONT_API_KEY }
          : {}),
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    const payload = await response.json().catch(() => ({
      success: false,
      error: 'We could not place that order. Please try again.',
    }));

    return NextResponse.json(payload, { status: response.status });
  } catch {
    return NextResponse.json(
      { success: false, error: 'We could not reach the shop. Please check your connection.' },
      { status: 502 }
    );
  }
}
