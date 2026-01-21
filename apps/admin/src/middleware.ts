import { NextRequest, NextResponse } from 'next/server';

// Public routes that don't require authentication
const publicPaths = ['/login'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public paths
  if (publicPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Allow API routes (they handle auth themselves)
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Allow static files and Next internals
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Check for accessToken cookie
  const token = req.cookies.get('accessToken')?.value;

  if (!token) {
    // Redirect to login
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Token exists, allow access
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
