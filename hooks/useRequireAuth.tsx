import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/context/SessionContext';

export function useRequireAuth(requiredRole?: string, redirectTo = '/login') {
  const { user, isLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push(redirectTo);
      } else if (requiredRole && user.userRole !== requiredRole) {
        router.push('/unauthorized');
      }
    }
  }, [user, isLoading, router, redirectTo, requiredRole]);

  return { user, isLoading };
}