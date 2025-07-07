import { create } from 'zustand';

import { User } from '@/entities/user';
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

export const useAuthStore = create<UseAuthState>((set, get) => ({
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

      if (!authUser) {
        set({ isLoadingInitialize: false });
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        throw profileError;
      }

      const user: User = {
        id: authUser.id,
        email: authUser.email!,
        name: profile.name ?? authUser.email!,
        avatar_url:
          profile.avatar_url ?? authUser.user_metadata?.avatar_url ?? null,
        banner_url:
          profile.banner_url ?? authUser.user_metadata?.banner_url ?? null,
        phone_number: profile.phone_number ?? null,
        date_of_birth: profile.date_of_birth ?? null,
        created_at: profile.created_at ?? new Date().toISOString(),
        updated_at: profile.updated_at ?? null,
        followers_count: profile.followers_count ?? 0,
        following_count: profile.following_count ?? 0,
        user_telegram: profile.user_telegram ?? null,
        bio: profile.bio ?? null,
      };

      set({ user, isAuth: true });
    } catch (err) {
      console.error('Auth initialization error:', err);
      set({
        error: err instanceof Error ? err.message : 'Ошибка инициализации',
      });
    } finally {
      set({ isLoadingInitialize: false });
    }
  },

  refreshUserProfile: async () => {
    const currentUser = get().user;
    if (!currentUser) return;

    try {
      const supabase = createClient();
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (error) throw error;

      const updatedUser: User = {
        ...currentUser,
        name: profile.name ?? currentUser.email,
        avatar_url: profile.avatar_url ?? currentUser.avatar_url,
        banner_url: profile.banner_url ?? currentUser.banner_url,
        phone_number: profile.phone_number ?? null,
        date_of_birth: profile.date_of_birth ?? null,
        updated_at: profile.updated_at ?? null,
        followers_count: profile.followers_count ?? 0,
        following_count: profile.following_count ?? 0,
        user_telegram: profile.user_telegram ?? null,
        bio: profile.bio ?? null,
      };

      set({ user: updatedUser });
    } catch (error) {
      console.error('Profile refresh error:', error);
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
          .single();

        if (profileError) throw profileError;

        const user: User = {
          id: authUser.id,
          email: authUser.email!,
          name: profile.name ?? authUser.email!,
          avatar_url:
            profile.avatar_url ?? authUser.user_metadata?.avatar_url ?? null,
          banner_url:
            profile.banner_url ?? authUser.user_metadata?.banner_url ?? null,
          phone_number: profile.phone_number ?? null,
          date_of_birth: profile.date_of_birth ?? null,
          created_at: profile.created_at ?? new Date().toISOString(),
          updated_at: profile.updated_at ?? null,
          followers_count: profile.followers_count ?? 0,
          following_count: profile.following_count ?? 0,
          user_telegram: profile.user_telegram ?? null,
          bio: profile.bio ?? null,
        };

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
          .single();

        const user: User = {
          id: authUser.id,
          email: authUser.email!,
          name: profile?.name ?? authUser.email!,
          avatar_url:
            profile?.avatar_url ?? authUser.user_metadata?.avatar_url ?? null,
          banner_url:
            profile?.banner_url ?? authUser.user_metadata?.banner_url ?? null,
          phone_number: profile?.phone_number ?? null,
          date_of_birth: profile?.date_of_birth ?? null,
          created_at: profile?.created_at ?? new Date().toISOString(),
          updated_at: profile?.updated_at ?? null,
          followers_count: profile?.followers_count ?? 0,
          following_count: profile?.following_count ?? 0,
          user_telegram: profile?.user_telegram ?? null,
          bio: profile?.bio ?? null,
        };

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

  clearError: () => set({ error: null }),
  updateCurrentUser: (user: User) => set({ user }),
}));
