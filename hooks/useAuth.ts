import { AuthResponse, User, LoginCredentials, RegisterCredentials, UserRole } from '@/types/user';
import { useState, useEffect } from 'react';

// Type for user data stored in state/localStorage (never includes password)
type SafeUser = Omit<User, 'password'>;

interface UseAuthState {
  user: SafeUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<UseAuthState>({
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as SafeUser;
        setAuthState(prev => ({
          ...prev,
          user: parsedUser,
          isAuthenticated: true
        }));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials),
        credentials: 'include' // Important for cookie handling
      });

      if (!response.ok) {
        throw new Error(
          response.status === 401 
            ? 'Invalid email or password' 
            : 'Login failed. Please try again.'
        );
      }

      const data: AuthResponse = await response.json();

      if (!data.user) {
        throw new Error('User data not found in response');
      }

      setAuthState(prev => ({
        ...prev,
        user: data.user,
        isAuthenticated: true,
        loading: false,
        error: null
      }));

      localStorage.setItem('user', JSON.stringify(data.user));
      return true;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      
      return false;
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials),
        credentials: 'include' // Important for cookie handling
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || 
          (response.status === 409 ? 'Email or username already exists' : 'Registration failed')
        );
      }

      const data: AuthResponse = await response.json();

      if (!data.user) {
        throw new Error('User data not found in response');
      }

      setAuthState(prev => ({
        ...prev,
        user: data.user,
        isAuthenticated: true,
        loading: false,
        error: null
      }));

      localStorage.setItem('user', JSON.stringify(data.user));
      return true;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAuthState({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null
      });
      localStorage.removeItem('user');
    }
  };

  return {
    ...authState,
    login,
    register,
    logout
  };
};