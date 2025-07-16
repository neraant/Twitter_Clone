import { Metadata } from 'next';

import { getCurrentUserAction } from '@/entities/user/api';
import { HomeClient } from '@/widgets/home-client/ui/HomeClient';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'Twitter Clone | Home',
  description: 'Welcome back! See what’s happening now ✨',

  openGraph: {
    title: 'Twitter Clone | Home',
    description: 'Welcome back! See what’s happening now ✨',
    url: BASE_URL,
    siteName: 'Twitter Clone',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: `${BASE_URL}/images/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Twitter Clone Home',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Twitter Clone | Home',
    description: 'Welcome back! See what’s happening now ✨',
    images: [`${BASE_URL}/images/og-image.png`],
  },
};

export default async function Home() {
  const user = await getCurrentUserAction();
  if (!user) return null;

  return <HomeClient currentUser={user} />;
}
