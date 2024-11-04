// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request:any) {
  const url = request.nextUrl.clone();
  const isLoggedIn = request.cookies.get('authToken');

  if (!isLoggedIn && url.pathname !== '/auth') {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  console.log(`[${new Date().toISOString()}] ${url.pathname}`);

  // Example: Custom header for security
  const response = NextResponse.next();
  response.headers.set('X-Custom-Header', 'ArtAuctionMiddleware');
  return response;
}

// Specify which paths to apply middleware to
export const config = {
  matcher: ['/', '/auctions/:path*', '/profile', '/admin/:path*'],
};
