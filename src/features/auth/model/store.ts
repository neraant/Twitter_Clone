import { create } from 'zustand';

import { createClient } from '@/shared/api/supabase/client';

import { loginWithPassword as loginWithPasswordRequest } from '../api';
import { signInWithGoogle } from '../api/googleAuth';
import { logout as logoutApi } from '../api/logout';
import { signUpWithPassword } from '../api/signUpWithPassword';
import { LoginCredentials, RegisterCredentials, UseAuthState } from './types';

export const useAuth = create<UseAuthState>((set) => ({
  user: null,
  isAuth: false,
  isLoading: false,
  error: null,

  initialize: async () => {
    set({ isLoading: true });
    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        const user = session.user;
        const authUser = {
          id: user.id,
          email: user.email!,
          name: user.user_metadata?.full_name || user.email!,
          avatarUrl: user.user_metadata?.avatar_url,
          phoneNumber: user.user_metadata?.phone,
          dateOfBirth: user.user_metadata?.date_of_birth,
        };
        set({ user: authUser, isAuth: true, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Ошибка инициализации',
        isLoading: false,
      });
    }
  },

  loginWithPassword: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await loginWithPasswordRequest(credentials);

      const user = data.user;
      if (user) {
        const authUser = {
          id: user.id,
          email: user.email!,
          name: user.user_metadata?.full_name || user.email!,
          avatarUrl: user.user_metadata?.avatar_url,
          phoneNumber: user.user_metadata?.phone,
          dateOfBirth: user.user_metadata?.date_of_birth,
        };

        set({ user: authUser, isAuth: true, isLoading: false });
      }
    } catch (error) {
      let message = 'Login error';

      if (error instanceof Error) {
        if (error.message === 'Invalid login credentials') {
          message = 'Invalid email or password';
        } else {
          message = error.message;
        }
      }

      set({
        error: message,
        isLoading: false,
      });

      throw new Error(message);
    }
  },

  loginWithGoogle: async () => {
    set({ isLoading: true, error: null });
    try {
      await signInWithGoogle();
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : 'Ошибка входа через Google',
        isLoading: false,
      });
      throw error;
    }
  },

  signUpWithPassword: async (credentials: RegisterCredentials) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await signUpWithPassword(credentials);

      const user = data.user;
      if (user) {
        const authUser = {
          id: user.id,
          email: user.email!,
          name: user.user_metadata?.full_name || user.email!,
          avatarUrl: user.user_metadata?.avatar_url,
          phoneNumber: user.user_metadata?.phone,
          dateOfBirth: user.user_metadata?.date_of_birth,
        };

        set({ user: authUser, isAuth: true, isLoading: false });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Ошибка входа',
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await logoutApi();
      set({ user: null, isAuth: false, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
