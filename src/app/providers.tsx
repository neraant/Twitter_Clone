import { ReactNode } from 'react';

import { AuthProvider } from '@/features/auth';
import { ThemeProvider } from '@/features/toggle-theme/lib';
import { ReactQueryProvider } from '@/shared/lib/providers';
import { ToastProvider } from '@/shared/lib/toast';
import { ToastContainer } from '@/shared/ui/toast';

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <ReactQueryProvider>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <ToastContainer />
            {children}
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </ReactQueryProvider>
  );
};
