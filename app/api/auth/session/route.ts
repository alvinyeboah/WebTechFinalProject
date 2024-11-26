import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import { AUTH_COOKIE_NAME } from '@/lib/constants';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    
    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const user = await getUserFromToken(token);
    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', user: null },
      { status: 500 }
    );
  }
}