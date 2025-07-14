import './globals.scss';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Suspense } from 'react';

import { GlobalLoader } from '@/shared/ui/global-loader';

import { Providers } from './providers';

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
          <Providers>{children}</Providers>
        </Suspense>
      </body>
    </html>
  );
}
