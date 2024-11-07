import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyTokenEdge } from './lib/edge-auth';
import { AUTH_COOKIE_NAME } from './lib/constants';
import { UserRole } from './types/user';

const PROTECTED_ROUTES = [
  {
    path: '/dashboard',
    roles: [UserRole.BUYER, UserRole.MUSEUM, UserRole.ARTIST]
  },
  {
    path: '/settings',
    roles: [UserRole.BUYER, UserRole.MUSEUM, UserRole.ARTIST]
  },
];

export async function middleware(request: NextRequest) {
  const authToken = request.cookies.get(AUTH_COOKIE_NAME);
  const url = request.nextUrl.clone();

  const protectedRoute = PROTECTED_ROUTES.find(route => 
    url.pathname.startsWith(route.path)
  );

  if (protectedRoute) {
    if (!authToken?.value) {
      return createLoginRedirect(request.url);
    }

    try {
      const tokenData = await verifyTokenEdge(authToken.value);
      if (!tokenData.userId || !tokenData.userRole || !protectedRoute.roles.includes(tokenData.userRole as UserRole)) {
        return createLoginRedirect(request.url);
      }
    } catch (error) {
      return createLoginRedirect(request.url);
    }
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
    '/dashboard/:path*',
    '/settings/:path*',
    '/auction/:path*',
    '/auth/:path*',
    '/api/protected/:path*'
  ]
};