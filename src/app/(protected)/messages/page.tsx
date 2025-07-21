import { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'Twitter Clone | Messages',
  description: 'Chat privately with friends 💬',

  openGraph: {
    title: 'Twitter Clone | Messages',
    description: 'Chat privately with friends 💬',
    url: `${BASE_URL}/messages`,
    siteName: 'Twitter Clone',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: `${BASE_URL}/images/og-image.webp`,
        width: 1200,
        height: 630,
        alt: 'Twitter Clone Messages',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Twitter Clone | Messages',
    description: 'Chat privately with friends 💬',
    images: [`${BASE_URL}/images/og-image.webp`],
  },
};

export default async function Messages() {
  return (
    <div>
      <h1>Messages</h1>
    </div>
  );
}
