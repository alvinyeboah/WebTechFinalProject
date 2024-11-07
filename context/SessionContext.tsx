"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { SessionContextType } from '@/types/session';
import { useRouter, usePathname } from 'next/navigation';
import toast from 'react-hot-toast';
import { User } from '@/types/user';

const SessionContext = createContext<SessionContextType | undefined>(undefined);
export const USER_QUERY_KEY = ['user'] as const;

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user) checkSession();
  }, [pathname]);

  const checkSession = async () => {
    try {
      const response = await fetch('/api/auth/session');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
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

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        toast.success('Successfully signed in!');
        const params = new URLSearchParams(window.location.search);
        const redirectTo = params.get('from') || '/dashboard';
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
        router.push('/auth/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('An error occurred during sign out');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SessionContext.Provider value={{ user, isLoading, login, logout }}>
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
