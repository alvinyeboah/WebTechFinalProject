/* eslint-disable */
import { NextRequest, NextResponse } from 'next/server';
import { setCookie, getCookie, deleteCookie } from 'cookies-next';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { db } from './db';
import { User, UserRole, RegisterCredentials } from '@/types/user';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET must be defined');
}

interface UserRow extends User, RowDataPacket {}

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRY = '1h';

interface JWTPayload {
  id: string;
  userRole: UserRole;
}

export const createToken = (userId: string, userRole: UserRole): string => {
  return jwt.sign({ id: userId, userRole }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
};

export const verifyToken = (token: string): JWTPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
};

export const loginUser = (req: NextRequest, userId: string, userRole: UserRole) => {
  const token = createToken(userId, userRole);
  const response = NextResponse.next();
  response.cookies.set('token', token, { 
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 3600 // 1 hour in seconds
  });
  return response;
};

export function logoutUser(req: NextRequest) {
  const response = NextResponse.json(
    { message: 'Logout successful' },
    { status: 200 }
  );

  response.cookies.set('authToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0
  });

  return response;
}

export const isAuthenticated = async (req: NextRequest) => {
  const token = req.cookies.get('token')?.value;
  return token ? verifyToken(token) : null;
};

export const validateUserCredentials = async (
  email: string, 
  password: string
): Promise<Omit<User, 'password'> | null> => {
  try {
    const query = `
      SELECT id, email, username, password, firstName, lastName, userRole, createdAt, lastLogin
      FROM users 
      WHERE email = ?
    `;
    
    const [rows] = await db.query<UserRow[]>(query, [email]);

    if (rows.length === 0) return null;

    const user = rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) return null;

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error('Error validating user credentials:', error);
    throw new Error('Database error during validation');
  }
};

export const registerUser = async (
  credentials: RegisterCredentials
): Promise<Omit<User, 'password'> | null> => {
  try {
    // Check if user already exists
    const [existingUsers] = await db.query<UserRow[]>(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [credentials.email, credentials.username]
    );

    if (existingUsers.length > 0) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(credentials.password, 10);
    
    const query = `
      INSERT INTO users (
        email, 
        username, 
        password, 
        firstName, 
        lastName, 
        userRole, 
        createdAt, 
        updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;

    const [result] = await db.query<ResultSetHeader>(query, [
      credentials.email,
      credentials.username,
      hashedPassword,
      credentials.firstName,
      credentials.lastName,
      credentials.userRole,
    ]);

    const newUser: Omit<User, 'password'> = {
      id: result.insertId.toString(),
      email: credentials.email,
      username: credentials.username,
      firstName: credentials.firstName,
      lastName: credentials.lastName,
      userRole: credentials.userRole,
      createdAt: new Date(),
      lastLogin: new Date(),
    };

    return newUser;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};