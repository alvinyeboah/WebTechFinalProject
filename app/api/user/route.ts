// app/api/user/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromToken } from '@/lib/auth';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { UpdateUserData } from '@/lib/api-client';
import { User } from '@/types/user';

interface UserRow extends RowDataPacket, Omit<User, 'password'> {
    id: string;
    email: string;
    username: string;
    firstName: string ;
    lastName: string ;
    userRole: any;
    createdAt: Date;
    lastLogin: Date;
    dob: any ;
    language: string;
    bio: string ;
    updatedAt: Date;
  }
  
export async function POST(request: any) {
  try {
    // 1. Get the auth token from cookies
    const authToken = request.cookies.get('authToken')?.value;
    
    if (!authToken) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Validate token and get user
    const currentUser = await getUserFromToken(authToken);
    if (!currentUser) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    // 3. Get update data from request
    const data: UpdateUserData = await request.json();

    // 4. Build update fields and values
    const updateFields: string[] = [];
    const values: any[] = [];

    // Only add fields that are present in the update data
    if (data.username !== undefined) {
      updateFields.push('username = ?');
      values.push(data.username);
    }
    
    if (data.email !== undefined) {
      updateFields.push('email = ?');
      values.push(data.email.toLowerCase());
    }
    
    if (data.bio !== undefined) {
      updateFields.push('bio = ?');
      values.push(data.bio);
    }

    if (data.firstName !== undefined) {
      updateFields.push('firstName = ?');
      values.push(data.firstName);
    }

    if (data.dob !== undefined) {
      updateFields.push('dob = ?');
      values.push(new Date(data.dob));
    }

    if (data.language !== undefined) {
      updateFields.push('language = ?');
      values.push(data.language);
    }

    if (data.userRole !== undefined) {
      updateFields.push('userRole = ?');
      values.push(data.userRole);
    }

    // If no fields to update, return current user data
    if (updateFields.length === 0) {
      return NextResponse.json(currentUser);
    }

    // Add updatedAt field
    updateFields.push('updatedAt = NOW()');

    // Add the user ID to values array
    values.push(currentUser.id);

    // Construct the query
    const updateQuery = `
      UPDATE users 
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `;

    // 5. Execute the update
    const [result] = await db.query<ResultSetHeader>(updateQuery, values);

    if (result.affectedRows !== 1) {
      return NextResponse.json(
        { error: "Failed to update user" },
        { status: 500 }
      );
    }

   // 6. Fetch and return the updated user data
   const [updatedRows] = await db.query<UserRow[]>(`
    SELECT id, email, username, firstName, lastName, 
           userRole, createdAt, lastLogin, dob, language, bio,
           updatedAt
    FROM users 
    WHERE id = ?
  `, [currentUser.id]);

  if (!updatedRows.length) {
    return NextResponse.json(
      { error: "User not found after update" },
      { status: 404 }
    );
  }

  // Type assertion is safe here because we just checked the length
  const updatedUser = updatedRows[0];

  // Format dates for JSON response
  const formattedUser = {
    ...updatedUser,
    createdAt: updatedUser.createdAt.toISOString(),
    lastLogin: updatedUser.lastLogin.toISOString(),
    updatedAt: updatedUser.updatedAt.toISOString(),
    dob: updatedUser.dob?.toISOString() || null
  };

  return NextResponse.json(formattedUser);

} catch (error) {
  console.error('Error updating user:', error);
  
  if (error instanceof Error && error.message.includes('Duplicate entry')) {
    return NextResponse.json(
      { error: "Email or username already taken" },
      { status: 400 }
    );
  }

  return NextResponse.json(
    { error: "Internal server error" },
    { status: 500 }
  );
}
}