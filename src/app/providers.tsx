'use client';

import { ReactNode } from 'react';

import { AuthProvider } from '@/features/auth';
import { ThemeProvider } from '@/features/toggle-theme/lib';
import { ToastProvider } from '@/shared/lib/toast';
import { ToastContainer } from '@/shared/ui/toast';

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <ToastContainer />
          {children}
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};
