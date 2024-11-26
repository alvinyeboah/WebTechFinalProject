import { NextRequest, NextResponse } from 'next/server';
import { validateUserCredentials, loginUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { identifier, password } = await req.json();
    
    if (!identifier || !password) {
      return NextResponse.json(
        { error: 'Email/username and password are required' },
        { status: 400 }
      );
    }

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
    const user = await validateUserCredentials(
      isEmail ? identifier : null,
      password,
      isEmail ? null : identifier
    );

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create login response with auth cookie
    const response = loginUser(user.id, user.userRole);

    return NextResponse.json(
      { user },
      { 
        status: 200,
        headers: response.headers
      }
    );

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 