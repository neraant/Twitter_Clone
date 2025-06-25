import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.scss';

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
      <body className={`${inter.variable} `}>{children}</body>
    </html>
  );
}
