import { NextResponse } from 'next/server';

const DOMAIN_BRANDS = {
  'happybuyfashion.com': 'happybuy',
  'www.happybuyfashion.com': 'happybuy',
  'lovemodabella.com': 'modabella',
  'www.lovemodabella.com': 'modabella',
  'cleopatraforever.com': 'cleopatra',
  'www.cleopatraforever.com': 'cleopatra',
};

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(request) {
  const host = request.headers.get('host')?.split(':')[0]?.toLowerCase();
  const brand = host ? DOMAIN_BRANDS[host] : null;

  if (!brand) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/logos') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/size-charts') ||
    pathname === '/favicon.ico' ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  if (pathname === `/${brand}` || pathname.startsWith(`/${brand}/`)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = pathname === '/' ? `/${brand}` : `/${brand}${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
