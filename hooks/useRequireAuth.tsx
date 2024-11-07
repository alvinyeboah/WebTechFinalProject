import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/context/SessionContext';
import { UserRole } from '@/types/user';
import toast from 'react-hot-toast';

export function useRequireAuth(allowedRoles?: UserRole[]) {
  const { user, isLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/auth/login');
        toast.error('Please sign in to access this page');
      } else if (allowedRoles && !allowedRoles.includes(user.userRole)) {
        router.push('/unauthorized');
        toast.error('You do not have permission to access this page');
      }
    }
  }, [user, isLoading, router, allowedRoles]);

  return { user, isLoading };
}