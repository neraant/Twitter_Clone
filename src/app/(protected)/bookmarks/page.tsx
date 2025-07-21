import { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'Twitter Clone | Bookmarks',
  description: 'Save your favorite tweets for later ⭐️',

  openGraph: {
    title: 'Twitter Clone | Bookmarks',
    description: 'Save your favorite tweets for later ⭐️',
    url: `${BASE_URL}/bookmarks`,
    siteName: 'Twitter Clone',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: `${BASE_URL}/images/og-image.webp`,
        width: 1200,
        height: 630,
        alt: 'Twitter Clone Bookmarks',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Twitter Clone | Bookmarks',
    description: 'Save your favorite tweets for later ⭐️',
    images: [`${BASE_URL}/images/og-image.webp`],
  },
};

export default async function Bookmarks() {
  return (
    <div>
      <h1>Bookmarks</h1>
    </div>
  );
}
