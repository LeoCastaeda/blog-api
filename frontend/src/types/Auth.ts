export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface RegisterCredentials {
    username: string;
    email: string;
    password: string;
    role: "Admin" | "SimpleUser";
  }
  
  import { User } from './User'; // Adjust the import path as necessary
  
  export interface AuthState {
      user: User | null;
      accessToken: string | null;
      refreshToken: string | null;
    }
  
  export interface AuthContextProps {
    auth: AuthState;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
    register: (credentials: RegisterCredentials) => Promise<void>;
  }
  