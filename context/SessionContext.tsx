"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { SessionContextType } from '@/types/session';
import { useRouter, usePathname } from 'next/navigation';
import toast from 'react-hot-toast';
import { User } from '@/types/user';

// Create a default context value with all required properties
const defaultContextValue: SessionContextType = {
  user: null,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
  checkSession: async () => {},
};

const SessionContext = createContext<SessionContextType>(defaultContextValue);
export const USER_QUERY_KEY = ['user'] as const;

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const checkSession = async () => {
    try {
      const response = await fetch('/api/auth/session');
      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          const sanitizedUser = {
            ...data.user,
            createdAt: data.user?.createdAt?.toString(),
            updatedAt: data.user?.updatedAt?.toString(),
          };
          setUser(sanitizedUser);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Session check failed:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (identifier: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();

      if (response.ok) {
        await checkSession(); // Fetch the user data after successful login
        toast.success('Successfully signed in!');
        const params = new URLSearchParams(window.location.search);
        const redirectTo = params.get('from') || '/';
        router.push(redirectTo);
      } else {
        toast.error(data.error || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        setUser(null);
        toast.success('Successfully signed out!');
        router.push('/');
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('An error occurred during sign out');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      checkSession();
    }
  }, [pathname]);

  return (
    <SessionContext.Provider value={{ user, isLoading, login, logout, checkSession }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
