import { NextResponse } from 'next/server';

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
      { success: false, error: 'PLATFORM_API_BASE_URL is not configured.' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const response = await fetch(`${baseUrl}/api/storefront/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });
    const payload = await response.json().catch(() => ({
      success: false,
      error: 'Platform chat returned an invalid response.',
    }));

    return NextResponse.json(payload, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Could not reach platform chat.',
      },
      { status: 500 }
    );
  }
}
