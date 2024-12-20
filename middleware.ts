import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyTokenEdge } from './lib/edge-auth';
import { AUTH_COOKIE_NAME } from './lib/constants';
import { UserRole } from './types/user';

const PUBLIC_PATHS = ['/auth/login', '/auth/register', '/'];

export async function middleware(request: NextRequest) {
  const authToken = request.cookies.get(AUTH_COOKIE_NAME);
  const url = request.nextUrl.clone();

  // Allow public paths
  if (PUBLIC_PATHS.includes(url.pathname)) {
    return NextResponse.next();
  }

  // Check authentication
  if (!authToken?.value) {
    return createLoginRedirect(request.url);
  }

  try {
    const tokenData = await verifyTokenEdge(authToken.value);
    if (!tokenData.userId) {
      return createLoginRedirect(request.url);
    }

    // Add role-based checks if needed
    if (url.pathname.startsWith('/dashboard') && tokenData.userRole === 'BUYER') {
      return NextResponse.redirect(new URL('/settings', request.url));
    }

  } catch (error) {
    return createLoginRedirect(request.url);
  }

  return addSecurityHeaders(NextResponse.next());
}

function createLoginRedirect(requestUrl: string) {
  const loginUrl = new URL('/auth/login', requestUrl);
  loginUrl.searchParams.set('callbackUrl', requestUrl);
  loginUrl.searchParams.set('showAuthToast', 'true'); // Set the parameter to show the toast
  return NextResponse.redirect(loginUrl);
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
    '/',
    '/dashboard/:path*',
    '/settings/:path*',
    '/auction/:path*',
    '/auth/:path*',
    '/api/protected/:path*'
  ]
};