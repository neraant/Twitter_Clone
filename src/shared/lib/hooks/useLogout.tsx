'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import { useAuthStore } from '@/features/auth/model';
import { routes } from '@/shared/config/routes';
import { useToast } from '@/shared/lib/toast';

export const useLogout = () => {
  const logout = useAuthStore((state) => state.logout);
  const isLoading = useAuthStore((state) => state.isLoadingLogout);
  const { showToast } = useToast();
  const router = useRouter();

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      showToast('Succes', 'Logout success!', 'success');
      router.replace(routes.auth.signUpMain);
    } catch (error) {
      console.error('Error while logout: ', error);
      showToast('Error', 'Logout failure!', 'error');
    }
  }, [logout, router, showToast]);

  return { handleLogout, isLoading };
};
