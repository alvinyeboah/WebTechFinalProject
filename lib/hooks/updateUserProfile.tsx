import { useState } from "react";
import { ApiError, updateUser, UpdateUserData } from "../api-client";


export function useUpdateProfile() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = async (data: UpdateUserData) => {
    setIsLoading(true);
    setError(null);

    try {
      const updatedUser = await updateUser(data);
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
