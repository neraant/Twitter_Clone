import { User } from '@/entities/user';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  password: string;
  name: string;
  phoneNumber: string;
  email: string;
  dateOfBirth?: string;
}

export interface UseAuthState {
  user: User | null;
  isAuth: boolean;
  isLoadingInitialize: boolean;
  isLoadingLogin: boolean;
  isLoadingGoogle: boolean;
  isLoadingSignUp: boolean;
  isLoadingLogout: boolean;
  error: string | null;

  initialize: () => void;
  loginWithPassword: (credentials: LoginCredentials) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signUpWithPassword: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}
