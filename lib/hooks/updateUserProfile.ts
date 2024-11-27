import { useState } from "react";
import { apiClient, ApiError, UpdateUserData } from "../api-client";
import { useSession } from "@/context/SessionContext";

export type UpdateProfileResponse = {
  success: boolean;
  error?: string;
  message?: string;
};

export function useUpdateProfile() {
  const { checkSession } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = async (data: UpdateUserData): Promise<UpdateProfileResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      await apiClient.updateUser(data);
      await checkSession();
      return {
        success: true,
        message: "Profile updated successfully"
      };
    } catch (err) {
      let errorMessage = "An unexpected error occurred";
      if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
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