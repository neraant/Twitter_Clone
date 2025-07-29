import { Metadata } from 'next';

import { BASE_URL } from '@/shared/lib/common';

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
        url: `${BASE_URL}/images/og-image.png`,
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
    images: [`${BASE_URL}/images/og-image.png`],
  },
};

export default async function Notifications() {
  return (
    <div>
      <h1>Notifications</h1>
    </div>
  );
}
