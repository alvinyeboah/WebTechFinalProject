
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/context/SessionContext';

export function useRequireAuth(redirectTo = '/login') {
  const { user, isLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(redirectTo);
    }
  }, [user, isLoading, router, redirectTo]);

  return { user, isLoading };
}