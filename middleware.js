import { NextResponse } from 'next/server';
import { getBrandForHost } from './lib/storefrontRouting';

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(request) {
  const brand = getBrandForHost(request.headers.get('host'));

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
    const url = request.nextUrl.clone();
    url.pathname = pathname === `/${brand}` ? '/' : pathname.slice(brand.length + 1);
    return NextResponse.redirect(url, 308);
  }

  const url = request.nextUrl.clone();
  url.pathname = pathname === '/' ? `/${brand}` : `/${brand}${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
