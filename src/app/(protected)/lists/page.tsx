import { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'Twitter Clone | Lists',
  description: 'Organize your tweets in lists 📋',

  openGraph: {
    title: 'Twitter Clone | Lists',
    description: 'Organize your tweets in lists 📋',
    url: `${BASE_URL}/lists`,
    siteName: 'Twitter Clone',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: `${BASE_URL}/images/og-image.webp`,
        width: 1200,
        height: 630,
        alt: 'Twitter Clone Lists',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Twitter Clone | Lists',
    description: 'Organize your tweets in lists 📋',
    images: [`${BASE_URL}/images/og-image.webp`],
  },
};

export default async function Lists() {
  return (
    <div>
      <h1>Lists</h1>
    </div>
  );
}
