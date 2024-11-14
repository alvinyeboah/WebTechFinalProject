// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { validateUserCredentials, loginUser } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    // Input validation
    const { identifier, password } = await req.json();
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);

    
    if (!identifier || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Validate credentials
    const user = await validateUserCredentials(isEmail ? identifier : null, password, isEmail ? null : identifier);

    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' }, 
        { status: 401 }
      );
    }


    const loginResponse = loginUser(user.id, user.userRole);
    
    const response = NextResponse.json(
      {
        message: 'Login successful',
      },
      { status: 200 }
    );
    const loginCookies = loginResponse.cookies;
    loginCookies.getAll().forEach(cookie => {
      response.cookies.set(cookie.name, cookie.value);
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}