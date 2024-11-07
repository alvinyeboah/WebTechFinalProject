import { NextResponse } from 'next/server';

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const createApiResponse = <T>(
  status: number,
  data: T | null,
  error?: string
) => ({
  status,
  data,
  error,
  timestamp: new Date().toISOString()
});

export const handleApiError = (error: unknown) => {
  if (error instanceof AppError) {
    return NextResponse.json(
      createApiResponse(error.statusCode, null, error.message),
      { status: error.statusCode }
    );
  }
  
  const defaultError = new AppError('An unexpected error occurred');
  return NextResponse.json(
    createApiResponse(defaultError.statusCode, null, defaultError.message),
    { status: defaultError.statusCode }
  );
};