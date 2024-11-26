import { useApi } from './useApi';
import { apiClient } from '@/lib/api-client';
import { useSession } from '@/context/SessionContext';
import { User } from '@/types/user';

export function useUserProfile() {
  const { checkSession } = useSession();
  const {
    data: profile,
    loading: profileLoading,
    error: profileError,
    execute: fetchProfile
  } = useApi(apiClient.getUserProfile);

  const {
    loading: updateLoading,
    error: updateError,
    execute: executeUpdate
  } = useApi(apiClient.updateUserProfile);

  const updateProfile = async (data: Partial<User>) => {
    const result = await executeUpdate(data);
    await checkSession();
    return result;
  };

  return {
    profile,
    profileLoading,
    profileError,
    updateLoading,
    updateError,
    fetchProfile,
    updateProfile
  };
} 