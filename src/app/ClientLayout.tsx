'use client';

import dynamic from 'next/dynamic';
import { PropsWithChildren, Suspense } from 'react';

import { GlobalLoader } from '@/shared/ui/global-loader';

const AuthProvider = dynamic(
  () => import('@/features/auth').then((m) => m.AuthProvider),
  {
    ssr: false,
  },
);
const ToastProvider = dynamic(
  () => import('@/shared/lib/toast/ToastContext').then((m) => m.ToastProvider),
  {
    ssr: false,
  },
);
const ToastContainer = dynamic(
  () => import('@/shared/ui/toast').then((m) => m.ToastContainer),
  {
    ssr: false,
  },
);

export const ClientLayout = ({ children }: PropsWithChildren) => {
  return (
    <Suspense fallback={<GlobalLoader />}>
      <AuthProvider>
        <ToastProvider>
          <ToastContainer />
          {children}
        </ToastProvider>
      </AuthProvider>
    </Suspense>
  );
};
