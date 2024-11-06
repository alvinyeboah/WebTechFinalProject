import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { db } from './db';
import { RegisterCredentials, User, UserRole } from '@/types/user';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { v4 as uuidv4 } from 'uuid';


if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET must be defined');
}

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRY = '1h';
const COOKIE_NAME = 'authToken';

interface JWTPayload {
  id: string;
  userRole: UserRole;
  iat?: number;
  exp?: number;
}

export const createToken = (userId: string, userRole: UserRole): string => {
  return jwt.sign(
    { 
      id: userId, 
      userRole 
    },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );
};

export const loginUser = (userId: string, userRole: UserRole): NextResponse => {
  const token = createToken(userId, userRole);
  const response = NextResponse.json(
    { message: 'Login successful' },
    { status: 200 }
  );
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 3600, // 1 hour
    path: '/'
  });

  return response;
};

export const validateUserCredentials = async (
  email: string,
  password: string
): Promise<Omit<User, 'password'> | null> => {
  try {
    // Input validation
    if (!email || !password) {
      return null;
    }

    // Query user
    const query = `
      SELECT id, email, username, password, firstName, lastName, userRole, 
             createdAt, lastLogin, dob, language, bio
      FROM users 
      WHERE email = ?
    `;
    
    const [rows] = await db.query<(User & RowDataPacket)[]>(query, [email]);

    if (rows.length === 0) return null;

    const user = rows[0];
    
    // Validate password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return null;

    // Update last login
    await db.query(
      'UPDATE users SET lastLogin = NOW() WHERE id = ?',
      [user.id]
    );

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error('Error validating user credentials:', error);
    throw new Error('Database error during validation');
  }
};

// Helper to verify token and get user data
export const getUserFromToken = async (token: string): Promise<Omit<User, 'password'> | null> => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    
    const query = `
      SELECT id, email, username, firstName, lastName, userRole, 
             createdAt, lastLogin, dob, language, bio
      FROM users 
      WHERE id = ?
    `;
    
    const [rows] = await db.query<(User & RowDataPacket)[]>(query, [decoded.id]);
    
    if (rows.length === 0) return null;
    
    const { password: _, ...userWithoutPassword } = rows[0];
    return userWithoutPassword;
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
};
const SALT_ROUNDS = 12;

export async function registerUser(credentials: RegisterCredentials): Promise<User> {
  // Check if user already exists
  const existingUserQuery = `
    SELECT id FROM users 
    WHERE email = ? OR username = ?
  `;
  
  const [existing] = await db.query<RowDataPacket[]>(
    existingUserQuery,
    [credentials.email, credentials.username]
  );

  if (existing.length > 0) {
    throw new Error('User already exists');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(credentials.password, SALT_ROUNDS);

  // Prepare user data
  const userData = {
    email: credentials.email.toLowerCase(),
    username: credentials.username,
    password: hashedPassword,
    firstName: credentials.firstName || null,
    lastName: credentials.lastName || null,
    userRole: credentials.userRole,
    language: credentials.language || 'en',
    createdAt: new Date(),
    lastLogin: new Date()
  };

  // Insert new user
  const insertQuery = `
    INSERT INTO users (
      email, username, password, firstName, lastName,
      userRole, language, createdAt, lastLogin, dob, language, bio
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?
    )
  `;

  const values = [
    userData.email,
    userData.username,
    userData.password,
    userData.firstName,
    userData.lastName,
    userData.userRole,
    userData.language,
    userData.createdAt,
    userData.lastLogin,
  ];

  try {
    const [result] = await db.query<ResultSetHeader>(insertQuery, values);

    if (result.affectedRows !== 1) {
      throw new Error('Failed to insert user');
    }

    // Get the inserted ID
    const insertedId = result.insertId;

    // Return created user (without password)
    const { password: _, ...userWithoutPassword } = {
      ...userData,
      id: insertedId
    };
    
    return userWithoutPassword as any;
  } catch (error) {
    console.error('Error during user registration:', error);
    throw error;
  }
}


export const verifyToken = (token: string): JWTPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
};

export const logoutUser = (): NextResponse => {
  const response = NextResponse.json(
    { message: 'Logout successful' },
    { status: 200 }
  );
  
  response.cookies.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/'
  });

  return response;
};