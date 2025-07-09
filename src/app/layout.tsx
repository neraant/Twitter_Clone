import './globals.scss';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { ClientLayout } from './ClientLayout';

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
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
