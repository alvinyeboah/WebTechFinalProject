import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const authToken = request.cookies.get('authToken');
  const url = request.nextUrl.clone();
  
  const protectedRoutes = ['/dashboard', '/settings'];
  const isProtectedRoute = protectedRoutes.some((route) => 
    url.pathname.startsWith(route)
  );
  
  if (isProtectedRoute) {
    if (!authToken?.value) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('from', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  return response;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/settings/:path*',
    '/auction/:path*'
  ]
};