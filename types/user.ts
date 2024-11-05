import { Bid } from "./bid";

export type UserRole = 'BUYER' | 'MUSEUM' | 'ARTIST';

export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  password: string;
  avatar?: string;
  createdAt: Date;
  lastLogin: Date;
  userRole: UserRole; 
  bidHistory?: Bid[];
  favorites?: string[];
}

export interface AuthResponse {
  user: Omit<User, 'password'>;  
  token: string;
  expiresIn: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  username: string;
  firstName?: string;
  lastName?: string;
  userRole: UserRole;
}