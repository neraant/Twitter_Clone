'use client';

import { useEffect } from 'react';

import { createClient } from '@/shared/api/supabase/client';

import { useAuth } from '../model';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const initialize = useAuth((state) => state.initialize);

  useEffect(() => {
    initialize();

    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        await initialize();
      } else if (event === 'SIGNED_OUT') {
        useAuth.setState({ user: null, isAuth: false, isLoading: false });
      }
    });

    return () => subscription.unsubscribe();
  }, [initialize]);

  return <>{children}</>;
};
