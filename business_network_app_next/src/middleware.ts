import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Paths that don't require authentication
const publicPaths = ['/login', '/register', '/forgot-password'];

// Paths that require authentication
const protectedPaths = [
  '/profile',
  '/settings',
  '/network',
  '/jobs',
  '/availability',
  '/companies',
];

export function middleware(request: NextRequest) {
  const authSession = request.cookies.get('__session')?.value;
  const { pathname } = request.nextUrl;

  // Check if the path is protected
  const isProtectedPath = protectedPaths.some(
    (path) => pathname.startsWith(path)
  );

  // Check if the path is public
  const isPublicPath = publicPaths.some(
    (path) => pathname.startsWith(path)
  );

  // Handle root path
  if (pathname === '/') {
    if (!authSession) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.redirect(new URL('/network', request.url));
  }

  // Redirect authenticated users from public paths to dashboard
  if (isPublicPath && authSession) {
    return NextResponse.redirect(new URL('/network', request.url));
  }

  // Redirect unauthenticated users to login
  if (isProtectedPath && !authSession) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Only run middleware on the following paths
  matcher: [
    '/',
    '/login',
    '/register',
    '/forgot-password',
    '/profile/:path*',
    '/settings/:path*',
    '/network/:path*',
    '/jobs/:path*',
    '/availability/:path*',
    '/companies/:path*',
  ],
};
