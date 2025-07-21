import { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'Twitter Clone | Notifications',
  description: 'Stay updated with the latest notifications 🔔',

  openGraph: {
    title: 'Twitter Clone | Notifications',
    description: 'Stay updated with the latest notifications 🔔',
    url: `${BASE_URL}/notifications`,
    siteName: 'Twitter Clone',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: `${BASE_URL}/images/og-image.webp`,
        width: 1200,
        height: 630,
        alt: 'Twitter Clone Notifications',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Twitter Clone | Notifications',
    description: 'Stay updated with the latest notifications 🔔',
    images: [`${BASE_URL}/images/og-image.webp`],
  },
};

export default async function Notifications() {
  return (
    <div>
      <h1>Notifications</h1>
    </div>
  );
}
