// middleware.js
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const isLoggedIn = request.cookies.get('authToken');
  const protectedRoutes = ['/dashboard', '/profile', '/account'];
  const isProtectedRoute = protectedRoutes.some((route) => url.pathname.startsWith(route));
  if (!isLoggedIn && isProtectedRoute) {
    url.pathname = '/auth/login';
    return NextResponse.redirect(url);
  }

  console.log(`[${new Date().toISOString()}] ${request.method} ${url.pathname}`);

  const response = NextResponse.next();
  response.headers.set('X-Custom-Header', 'ArtAuctionMiddleware');
  response.headers.set('X-Frame-Options', 'DENY'); 
  response.headers.set('X-Content-Type-Options', 'nosniff'); 
  response.headers.set('X-XSS-Protection', '1; mode=block'); 

  return response;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/account/:path*',
    '/auction/:path*'
  ],
};
