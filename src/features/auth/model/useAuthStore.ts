import { create } from 'zustand';

import { User } from '@/entities/user';
import { createClient } from '@/shared/api/supabase/client';

import { loginWithPassword as loginWithPasswordRequest } from '../api';
import { signInWithGoogle } from '../api/googleAuth';
import { logout as logoutApi } from '../api/logout';
import { signUpWithPassword } from '../api/signUpWithPassword';
import { buildUserFromAuth } from '../lib';
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

      if (authError && authError.message?.includes('refresh_token_not_found')) {
        set({ isLoadingInitialize: false });
        return;
      }

      if (authError) throw authError;

      if (!authUser) {
        set({ isLoadingInitialize: false });
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        throw profileError;
      }

      const user = buildUserFromAuth(authUser, profile);

      set({ user, isAuth: true });
    } catch (err) {
      const error = err as Error;
      if (!error.message?.includes('refresh_token_not_found')) {
        set({
          error: error.message || 'Initialization error',
        });
      }
    } finally {
      set({ isLoadingInitialize: false });
    }
  },

  loginWithPassword: async (credentials: LoginCredentials) => {
    set({ isLoadingLogin: true, error: null });
    try {
      const { data } = await loginWithPasswordRequest(credentials);
      const authUser = data.user;
      if (authUser) {
        const supabase = createClient();
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .maybeSingle();

        if (profileError) throw profileError;

        const user = buildUserFromAuth(authUser, profile);

        set({ user, isAuth: true });
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
      const authUser = data.user;
      if (authUser) {
        const supabase = createClient();
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .maybeSingle();

        const user = buildUserFromAuth(authUser, profile);

        set({ user, isAuth: true });
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

  updateCurrentUser: (user: User) => set({ user }),
}));
