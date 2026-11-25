import { NextRequest, NextResponse } from 'next/server';
import { SITE_URL } from '@/lib/siteMetadata';
export function proxy(request: NextRequest) {
  const host = request.nextUrl.hostname;
  const canonical = new URL(SITE_URL);
  if (host === 'omoikaneinnovations.com') {
    const target = new URL(request.nextUrl.pathname + request.nextUrl.search, canonical);
    return NextResponse.redirect(target, 308);
  }
  const response = NextResponse.next();
  if (host !== canonical.hostname || process.env.VERCEL_ENV !== 'production') {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }
  return response;
}
export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] };
