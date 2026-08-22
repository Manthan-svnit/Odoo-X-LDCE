import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow all API routes (API routes handle their own auth checks)
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Allow public shared links
  if (pathname.startsWith('/shared/')) {
    return NextResponse.next();
  }

  // Check for the JWT token cookie
  const token = request.cookies.get(process.env.COOKIE_NAME || 'gt_token')?.value;

  // If user is trying to access a public route and IS logged in, redirect to dashboard
  if (PUBLIC_ROUTES.includes(pathname)) {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // If user is trying to access a protected route and IS NOT logged in, redirect to login
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - fonts (font files)
     */
    '/((?!_next/static|_next/image|favicon.ico|fonts).*)',
  ],
};
