import { User } from "@/types/user";

export type UpdateUserData = {
    username?: string;
    email?: string;
    bio?: string;
    firstName?: string;
    dob?: Date;
    language?: string;
    userRole?: "BUYER" | "SELLER" | "ARTIST" | "MUSEUM";
  };
  
  export class ApiError extends Error {
    constructor(public status: number, message: string) {
      super(message);
      this.name = "ApiError";
    }
  }
  
  export async function updateUser(data: UpdateUserData) {
    const response = await fetch("/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  
    if (!response.ok) {
      const error = await response.json();
      throw new ApiError(
        response.status,
        error.error || "Failed to update user"
      );
    }
  
    return response.json();
  }
  
  