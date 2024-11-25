import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import { ResultSetHeader } from 'mysql2';
import { db } from '@/lib/db';
import { UpdateUserData } from '@/lib/api-client';

export async function POST(req: NextRequest) {
  try {
    const tokenCookie = req.cookies.get('authToken');
    if (!tokenCookie || !tokenCookie.value) {
      return NextResponse.json({ error: 'Unauthorized - No token' }, { status: 401 });
    }

    const user = await getUserFromToken(tokenCookie.value);
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const updateData: UpdateUserData = await req.json();
    
    // Build the SQL update query dynamically based on provided fields
    const updates: string[] = [];
    const values: any[] = [];
    
    Object.entries(updateData).forEach(([key, value]) => {
      if (value !== undefined) {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    // Add user ID to values array
    values.push(user.id);

    const updateQuery = `
      UPDATE users 
      SET ${updates.join(', ')}, updatedAt = NOW()
      WHERE id = ?
    `;

    const [result] = await db.query<ResultSetHeader>(updateQuery, values);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Failed to update user' }, { status: 400 });
    }

    return NextResponse.json(
      { message: 'User updated successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('User update error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}