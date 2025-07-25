import './globals.scss';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { AuthProvider } from '@/features/auth';
import { ToastProvider } from '@/shared/lib/toast/ToastContext';
import { ToastContainer } from '@/shared/ui/toast';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
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
      <body className={`${inter.variable} `}>
        <AuthProvider>
          <ToastProvider>
            <ToastContainer />
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
