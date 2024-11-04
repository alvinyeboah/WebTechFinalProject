import { Bid } from "./bid";

export interface User {
    id: string;
    email: string;
    username: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
    createdAt: Date;
    updatedAt: Date;
    role: 'USER' | 'ADMIN';
    bidHistory?: Bid[];
    favorites?: string[]; 
  }
  
  export interface AuthResponse {
    user: User;
    token: string;
    expiresIn: number;
  }
  
  export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface RegisterCredentials extends LoginCredentials {
    username: string;
    firstName?: string;
    lastName?: string;
  }