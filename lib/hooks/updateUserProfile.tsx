import { useState } from "react";
import { apiClient, ApiError, UpdateUserData } from "../api-client";
import { useSession } from "@/context/SessionContext";

export function useUpdateProfile() {
  const { checkSession } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = async (data: UpdateUserData) => {
    setIsLoading(true);
    setError(null);

    try {
      const updatedUser = await apiClient.updateUser(data);
      await checkSession();
      return updatedUser;
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateProfile,
    isLoading,
    error,
  };
}