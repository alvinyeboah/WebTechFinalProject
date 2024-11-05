import { AuthResponse, User } from '@/types/user';
import { useState, useEffect } from 'react';

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignUpCredentials {
  email: string;
  fName: string;
  lName: string;
  password: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setLoading(true); // Set loading state
    setError(null); // Reset error state
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      if (!response.ok) {
        throw new Error('Invalid email or password'); // More descriptive error
      }

      const data: AuthResponse = await response.json();

      if (data.user) {
        setUser(data.user);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(data.user));
        return true;
      } else {
        throw new Error('User data not found in response');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message); // Set error state
      return false;
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const signUp = async (credentials: SignUpCredentials): Promise<boolean> => {
    setLoading(true); // Set loading state
    setError(null); // Reset error state
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      if (!response.ok) {
        throw new Error('Sign up failed');
      }

      const data: AuthResponse = await response.json();

      if (data.user) {
        setUser(data.user);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(data.user));
        return true;
      } else {
        throw new Error('User data not found in response');
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      setError(error.message); // Set error state
      return false;
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const logout = (): void => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    signUp,
    logout
  };
};
