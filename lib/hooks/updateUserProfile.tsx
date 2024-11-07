import { useState } from "react";
import { ApiError, updateUser, UpdateUserData } from "../api-client";
import { useSession } from "@/context/SessionContext";

export function useUpdateProfile() {
  const { checkSession } = useSession(); // Get checkSession from context
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = async (data: UpdateUserData) => {
    setIsLoading(true);
    setError(null);

    try {
      const updatedUser = await updateUser(data);
      await checkSession(); // Refetch the session after updating
      return updatedUser;
    } catch (err) {
      if (err instanceof ApiError) {
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