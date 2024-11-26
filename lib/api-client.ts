import { ApiResponse, ApiResponseType } from "@/types/api";
import { Artwork } from "@/types/artwork";
import { Bid } from "@/types/bid";
import { User } from "@/types/user";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export type UpdateUserData = {
  username?: string;
  email?: string;
  bio?: string;
  firstName?: string;
  lastName?: string;
  // Add any other fields that can be updated
};

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

class ApiClient {
  private async fetchWithAuth<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponseType<T>> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include",
    });

    const data: ApiResponseType<T> = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "An error occurred");
    }

    return data;
  }

  // Artwork endpoints
  async getArtworks(): Promise<Artwork[]> {
    const response = await this.fetchWithAuth<Artwork[]>("/api/artworks");
    return response.data || [];
  }

  async getArtworkById(id: string): Promise<Artwork> {
    const response = await this.fetchWithAuth<Artwork>(`/api/artworks/${id}`);
    if (!response.data) {
      throw new Error("Artwork not found");
    }
    return response.data;
  }

  // Bidding endpoints
  async placeBid(artworkId: string, amount: number): Promise<Bid> {
    const response = await this.fetchWithAuth<Bid>("/api/bids", {
      method: "POST",
      body: JSON.stringify({ artworkId, amount }),
    });
    if (!response.data) {
      throw new Error("Failed to place bid");
    }
    return response.data;
  }

  async cancelBid(bidId: string): Promise<void> {
    await this.fetchWithAuth(`/api/bids/${bidId}/cancel`, {
      method: "POST",
    });
  }

  // User endpoints
  async updateUserProfile(data: Partial<User>): Promise<User> {
    const response = await this.fetchWithAuth<User>("/api/user", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    if (!response.data) {
      throw new Error("Failed to update user profile");
    }
    return response.data;
  }

  async getUserProfile(): Promise<User> {
    const response = await this.fetchWithAuth<User>("/api/user");
    if (!response.data) {
      throw new Error("User profile not found");
    }
    return response.data;
  }

  async updateUser(data: UpdateUserData): Promise<User> {
    const response = await this.fetchWithAuth<User>('/api/user', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    if (!response.data) {
      throw new Error("Failed to update user profile");
    }
    return response.data;
  }
}

export const apiClient = new ApiClient();
