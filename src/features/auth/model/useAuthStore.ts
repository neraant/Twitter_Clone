import { create } from 'zustand';

import { createClient } from '@/shared/api/supabase/client';

import { loginWithPassword as loginWithPasswordRequest } from '../api';
import { signInWithGoogle } from '../api/googleAuth';
import { logout as logoutApi } from '../api/logout';
import { signUpWithPassword } from '../api/signUpWithPassword';
import {
  LoginCredentials,
  RegisterCredentials,
  UseAuthState,
} from './auth.types';

export const useAuthStore = create<UseAuthState>((set) => ({
  user: null,
  isAuth: false,
  error: null,

  isLoadingInitialize: true,
  isLoadingLogin: false,
  isLoadingGoogle: false,
  isLoadingSignUp: false,
  isLoadingLogout: false,

  initialize: async () => {
    set({ isLoadingInitialize: true, error: null });
    try {
      const supabase = createClient();

      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError) throw authError;

      if (!authUser) return;

      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (profileError) throw profileError;

      const user = {
        id: authUser.id,
        email: authUser.email!,
        name: profile.name ?? authUser.email!,
        avatar_url: profile.avatar_url ?? authUser.user_metadata?.avatar_url,
        phone_number: profile.phone_number,
        date_of_birth: profile.date_of_birth,
        created_at: profile.created_at,
        updated_at: profile.updated_at,
        followers_count: profile.followers_count,
        following_count: profile.following_count,
      };

      set({ user, isAuth: true });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Ошибка инициализации',
      });
    } finally {
      set({ isLoadingInitialize: false });
    }
  },

  loginWithPassword: async (credentials: LoginCredentials) => {
    set({ isLoadingLogin: true, error: null });
    try {
      const { data } = await loginWithPasswordRequest(credentials);
      const user = data.user;
      if (user) {
        const authUser = {
          id: user.id,
          email: user.email!,
          name: user.user_metadata?.full_name || user.email!,
          avatar_url: user.user_metadata?.avatar_url,
          phone_number: user.user_metadata?.phone,
          date_of_birth: user.user_metadata?.date_of_birth,
          created_at: user.user_metadata?.created_at,
          updated_at: user.user_metadata?.updated_at,
          followers_count: user.user_metadata?.followers_count,
          following_count: user.user_metadata?.following_count,
        };
        set({ user: authUser, isAuth: true });
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
      set({ error: message });
      throw new Error(message);
    } finally {
      set({ isLoadingLogin: false });
    }
  },

  loginWithGoogle: async () => {
    set({ isLoadingGoogle: true, error: null });
    try {
      await signInWithGoogle();
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : 'Ошибка входа через Google',
      });
      throw error;
    } finally {
      set({ isLoadingGoogle: false });
    }
  },

  signUpWithPassword: async (credentials: RegisterCredentials) => {
    set({ isLoadingSignUp: true, error: null });
    try {
      const { data } = await signUpWithPassword(credentials);
      const user = data.user;
      if (user) {
        const authUser = {
          id: user.id,
          email: user.email!,
          name: user.user_metadata?.full_name || user.email!,
          avatar_url: user.user_metadata?.avatar_url,
          phone_number: user.user_metadata?.phone,
          date_of_birth: user.user_metadata?.date_of_birth,
          created_at: user.user_metadata?.created_at,
          updated_at: user.user_metadata?.updated_at,
          followers_count: user.user_metadata?.followers_count,
          following_count: user.user_metadata?.following_count,
        };
        set({ user: authUser, isAuth: true });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Ошибка регистрации',
      });
      throw error;
    } finally {
      set({ isLoadingSignUp: false });
    }
  },

  logout: async () => {
    set({ isLoadingLogout: true });
    try {
      await logoutApi();
      set({ user: null, isAuth: false });
    } catch (error) {
      throw error;
    } finally {
      set({ isLoadingLogout: false });
    }
  },

  clearError: () => set({ error: null }),
}));
