import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['ar', 'fr', 'en'],
  defaultLocale: 'ar',
  localePrefix: 'always',
  // Redirect /en to /ar
});

const nextConfig = {
  async redirects() {
    return [
      {
        source: '/en',
        destination: '/ar',
        permanent: true,
      },
      {
        source: '/en/:path*',
        destination: '/ar/:path*',
        permanent: true,
      },
    ];
  },
};
export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)', '/']
};
