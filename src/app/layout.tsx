import './globals.scss';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Suspense } from 'react';

import { AuthProvider } from '@/features/auth';
import { ToastProvider } from '@/shared/lib/toast';
import { GlobalLoader } from '@/shared/ui/global-loader';
import { ToastContainer } from '@/shared/ui/toast';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Twitter Clone',
  description: 'Twitter Clone Application',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.variable}>
        <Suspense fallback={<GlobalLoader />}>
          <AuthProvider>
            <ToastProvider>
              <ToastContainer />
              {children}
            </ToastProvider>
          </AuthProvider>
        </Suspense>
      </body>
    </html>
  );
}
