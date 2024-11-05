import { NextRequest, NextResponse } from 'next/server';
import { validateUserCredentials, loginUser } from '@/lib/auth'; 
import { User } from '@/types/user';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const user: User | null = await validateUserCredentials(email, password);
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }
    loginUser(req, user.id); 

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
