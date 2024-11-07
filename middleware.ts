import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyTokenEdge } from './lib/edge-auth';
import { AUTH_COOKIE_NAME } from './lib/constants';

export async function middleware(request: NextRequest) {
  const authToken = request.cookies.get(AUTH_COOKIE_NAME);
  const url = request.nextUrl.clone();

  // Improved route protection patterns
  const protectedPatterns = [
    '/dashboard',
    '/settings',
    '/auction',
    '/api/protected'
  ];

  const isProtectedRoute = protectedPatterns.some(pattern => 
    url.pathname.startsWith(pattern)
  );

  const isAuthPage = url.pathname.startsWith('/auth/');

  if (authToken?.value) {
    try {
      const tokenData = await verifyTokenEdge(authToken.value);
      
      if (!tokenData.userId) {
        return createLoginRedirect(request.url);
      }

      // Redirect authenticated users away from auth pages
      if (isAuthPage) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }

    } catch (error) {
      console.error('Token verification error:', error);
      return createLoginRedirect(request.url);
    }
  } else if (isProtectedRoute) {
    return createLoginRedirect(request.url);
  }

  return addSecurityHeaders(NextResponse.next());
}

function createLoginRedirect(requestUrl: string) {
  const loginUrl = new URL('/auth/login', requestUrl);
  loginUrl.searchParams.set('callbackUrl', requestUrl);
  loginUrl.searchParams.set('showAuthToast', 'true');
  const response = NextResponse.redirect(loginUrl);
  response.cookies.delete(AUTH_COOKIE_NAME);
  return response;
}

function addSecurityHeaders(response: NextResponse) {
  const headers = {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
  };

  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/settings/:path*',
    '/auction/:path*',
    '/auth/:path*',
    '/api/protected/:path*'
  ]
};