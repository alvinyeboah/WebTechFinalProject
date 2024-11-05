import { NextApiRequest, NextApiResponse } from 'next';
import { setCookie, getCookie, deleteCookie } from 'cookies-next';
import jwt from 'jsonwebtoken';
import { User, RegisterCredentials } from '@/types/user';
import bcrypt from 'bcrypt';
import { db } from './db';
import { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const createToken = (userId: string): string => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1h' }); // Token expires in 1 hour
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null; // Token is invalid
  }
};

export const loginUser = (req: NextRequest, userId: string) => {
  const token = createToken(userId);
  const response = NextResponse.next();
  response.cookies.set('token', token, { maxAge: 3600 });
  return response;
};

export const logoutUser = (req: NextApiRequest) => {
  deleteCookie('token', { req }); // Remove token cookie
};

export const isAuthenticated = (req: NextApiRequest) => {
  const token = getCookie('token', { req });
  return token ? verifyToken(token) : null; // Return the decoded token or null if not authenticated
};

export const validateUserCredentials = async (email: string, password: string): Promise<User | null> => {
  try {
    // Fetch the user from the database
    const result = await db.query<User>('SELECT id, email, username, password, createdAt FROM users WHERE email = ?', [email]);

    // Check if user exists and validate the password
    if (result.length > 0) {
      const user = result[0];
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (isValidPassword) {
        return user; // Return the user object if credentials are valid
      }
    }
    return null; // Return null if credentials are invalid
  } catch (error) {
    console.error('Error validating user credentials:', error);
    return null; // Handle any errors that may occur
  }
};

export const registerUser = async (
  email: string,
  password: string,
  username: string,
  firstName?: string,
  lastName?: string
): Promise<User | null> => {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const result = await db.query<{ insertedId: string }>('INSERT INTO users (email, username, password, firstName, lastName, createdAt) VALUES (?, ?, ?, ?, ?, NOW())', [
      email,
      username,
      hashedPassword,
      firstName,
      lastName,
    ]);

    // Return the new user object
    return {
      id: result[0].insertedId,
      email,
      username,
      firstName,
      lastName,
      createdAt: new Date(),
    };
  } catch (error) {
    console.error('Error registering user:', error);
    return null;
  }
};