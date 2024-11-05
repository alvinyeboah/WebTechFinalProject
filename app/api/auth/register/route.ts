import { NextRequest, NextResponse } from 'next/server';
import { registerUser, loginUser } from '@/lib/auth';
import { RegisterCredentials, User } from '@/types/user';

// Type guard to check if a field exists in RegisterCredentials
function isRegisterCredentialField(field: string): field is keyof RegisterCredentials {
  return ['email', 'password', 'username', 'userRole', 'firstName', 'lastName'].includes(field);
}

interface RegistrationError extends Error {
  message: string;
}

export async function POST(req: NextRequest) {
  try {
    // Log the raw request body for debugging
    const rawBody = await req.text();
    console.log('Raw request body:', rawBody);

    // Parse the JSON body
    let credentials: RegisterCredentials;
    try {
      credentials = JSON.parse(rawBody);
    } catch (e) {
      console.error('JSON parsing error:', e);
      return NextResponse.json(
        { error: 'Invalid JSON payload' },
        { status: 400 }
      );
    }

    // Log the parsed credentials (excluding password)
    console.log('Parsed credentials:', {
      ...credentials,
      password: '[REDACTED]'
    });

    // Validate payload structure
    if (!credentials || typeof credentials !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request payload structure' },
        { status: 400 }
      );
    }

    // Validate required fields with type safety and detailed feedback
    const requiredFields = ['email', 'password', 'username', 'userRole'] as const;
    const missingFields = requiredFields.filter(field => {
      if (isRegisterCredentialField(field)) {
        const value = credentials[field];
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          return true;
        }
      }
      return false;
    });

    if (missingFields.length > 0) {
      console.warn('Missing required fields:', missingFields);
      return NextResponse.json(
        { 
          error: `Missing required fields: ${missingFields.join(', ')}`,
          fields: missingFields
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(credentials.email)) {
      console.warn('Invalid email format:', credentials.email);
      return NextResponse.json(
        { 
          error: 'Invalid email format',
          field: 'email'
        },
        { status: 400 }
      );
    }

    // Validate password requirements with detailed feedback
    const passwordRequirements = {
      minLength: credentials.password.length >= 8,
      hasUpperCase: /[A-Z]/.test(credentials.password),
      hasLowerCase: /[a-z]/.test(credentials.password),
      hasNumber: /\d/.test(credentials.password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(credentials.password),
    };

    const failedRequirements = Object.entries(passwordRequirements)
      .filter(([, passes]) => !passes)
      .map(([requirement]) => requirement);

    if (failedRequirements.length > 0) {
      console.warn('Password validation failed:', failedRequirements);
      return NextResponse.json(
        {
          error: 'Password does not meet requirements',
          field: 'password',
          failedRequirements
        },
        { status: 400 }
      );
    }

    // Validate userRole
    const validRoles = ['BUYER', 'ARTIST', 'MUSEUM'];
    if (!validRoles.includes(credentials.userRole)) {
      return NextResponse.json(
        {
          error: 'Invalid user role',
          field: 'userRole',
          validRoles
        },
        { status: 400 }
      );
    }

    console.log('All validations passed, attempting registration...');
    const user = await registerUser(credentials);

    if (!user) {
      console.error('Registration failed - no user returned');
      return NextResponse.json(
        { error: 'Registration failed' },
        { status: 400 }
      );
    }

    // Create response with login cookie
    const response = loginUser(req, user.id, user.userRole);

    // Return the user data without the password
    const { password: _, ...safeUser } = user as User;
    console.log('Registration successful:', safeUser);
    return NextResponse.json({ user: safeUser }, { status: 201 });

  } catch (error: unknown) {
    console.error('Registration error:', error);

    // Type guard for error message
    const isRegistrationError = (error: unknown): error is RegistrationError => {
      return error instanceof Error && 'message' in error;
    };

    if (isRegistrationError(error)) {
      if (error.message === 'User already exists') {
        return NextResponse.json(
          { error: 'Email or username already exists' },
          { status: 409 }
        );
      }
      
      // Log the actual error message for debugging
      console.error('Detailed error:', error.message);
    }

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}