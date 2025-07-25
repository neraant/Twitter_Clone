export interface AuthUser {
  id: string;
  name: string;
  phoneNumber?: string;
  email: string;
  dateOfBirth?: string;
  avatarUrl?: string;
}

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
  user: AuthUser | null;
  isAuth: boolean;
  isLoading: boolean;
  error: string | null;

  initialize: () => void;
  loginWithPassword: (credentials: LoginCredentials) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signUpWithPassword: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}
