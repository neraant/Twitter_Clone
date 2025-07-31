import './globals.scss';
import '@/styles/nprogress-custom.scss';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import React, { Suspense } from 'react';

import { themeScript } from '@/features/toggle-theme/lib';
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

import Script from 'next/script';

import { TopLoader } from '@/shared/ui/top-loader';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={inter.variable}>
        <Script
          id='theme-script'
          strategy='beforeInteractive'
          dangerouslySetInnerHTML={{
            __html: themeScript,
          }}
        />

        <TopLoader />

        <Providers>
          <Suspense fallback={<GlobalLoader />}>{children}</Suspense>
        </Providers>
      </body>
    </html>
  );
}
