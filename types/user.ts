import { Bid } from "./bid";

export enum UserRole {
  BUYER = 'BUYER', 
  MUSEUM = 'MUSEUM',
  ARTIST = 'ARTIST',
}

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
  createdAt?: string;
  updatedAt?: string;
  lastLogin: Date;
  userRole: UserRole; 
  bidHistory?: Bid[];
  language?:string;
  dob?:any;
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
  bio?: string;  // Optional bio field
}