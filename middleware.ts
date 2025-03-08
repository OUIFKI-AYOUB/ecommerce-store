import createMiddleware from 'next-intl/middleware';
import { NextResponse, NextRequest } from 'next/server';

const middleware = createMiddleware({
  locales: ['ar', 'fr', 'en'],
  defaultLocale: 'ar',
  localePrefix: 'always',
  
});

export default function (request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the user has a locale cookie
  const localeCookie = request.cookies.get('NEXT_LOCALE');

  // Redirect root URL (`/`) to `/ar` only if no locale cookie is set
  if (pathname === '/' && !localeCookie) {
    const response = NextResponse.redirect(new URL('/ar', request.url));

    // Set a cookie to remember the user's initial locale
    response.cookies.set('NEXT_LOCALE', 'ar', {
      path: '/',
      maxAge: 365 * 24 * 60 * 60, // 1 year
    });

    return response;
  }

  return middleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)', '/']
};