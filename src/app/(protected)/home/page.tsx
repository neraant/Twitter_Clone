import { Metadata } from 'next';

import { getCurrentUserAction } from '@/entities/user/api';
import { HomeClient } from '@/widgets/home-client/ui/HomeClient';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'Twitter Clone | Home',
  description: 'This is the home page',
  openGraph: {
    title: 'Twitter Clone | Home',
    description: 'Join us! Tweets are waiting for you!❤️',
    url: BASE_URL,
    siteName: 'Twitter Clone',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: `${BASE_URL}/images/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Twitter Clone OG Image',
      },
    ],
  },
};

export default async function Home() {
  const user = await getCurrentUserAction();
  if (!user) return null;

  return <HomeClient currentUser={user} />;
}
