// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { validateUserCredentials, loginUser } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    // Input validation
    const { email, password } = await req.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Validate credentials
    const user = await validateUserCredentials(email, password);
    
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
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          userRole: user.userRole,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin,
          language: user.language,
          dob:user.dob,
          bio: user.bio,
        }
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