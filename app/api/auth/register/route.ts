import { NextRequest, NextResponse } from 'next/server';
import { registerUser, loginUser } from '@/lib/auth';
import { User, RegisterCredentials } from '@/types/user';

export async function POST(req: NextRequest) {
  try {
    const { email, password, username, firstName, lastName }: RegisterCredentials = await req.json();
    const user: User | null = await registerUser(email, password, username, firstName, lastName);

    if (!user) {
      return NextResponse.json({ error: 'Registration failed' }, { status: 400 });
    }

    loginUser(req, user.id);

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}