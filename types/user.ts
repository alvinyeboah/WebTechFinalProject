import { Bid } from "./bid";

export type UserRole = 'BUYER' | 'MUSEUM' | 'ARTIST';

export interface DBUser {
  id: string;
  email: string;
  password: string;  
  userRole: UserRole;
  firstName?: string;
  lastName?: string;
  username: string;
}

export type SafeUser = Omit<DBUser, 'password'>;


export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  password: string;
  bio:string;
  avatar?: string;
  createdAt: Date;
  lastLogin: Date;
  userRole: UserRole; 
  bidHistory?: Bid[];
  language?:string;
  dob?:string;
  favorites?: string[];
}

export interface AuthResponse {
  user: Omit<User, 'password'>;  
  token: string;
  expiresIn: number;
  message:string;
  error:string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  username: string;
  userRole: DBUser['userRole'];
  firstName?: string;
  language?: string; // New field
  lastName?: string;
}