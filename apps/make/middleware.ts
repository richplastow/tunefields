import createMiddleware from 'next-intl/middleware';
 
export default createMiddleware({
  // A list of all locales that are supported.
  locales: ['en', 'pt'],
 
  // Used when no locale matches.
  defaultLocale: 'en'
});
 
export const config = {
  // Match only internationalised path names.
  matcher: ['/', '/(en|pt)/:path*']
};
