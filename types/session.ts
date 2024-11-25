import { User } from "./user";

  
  export interface SessionContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    checkSession: () => void; // Add this line

  }