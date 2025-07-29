import { Metadata } from 'next';

import { ExploreClient, searchType } from '@/widgets/explore-client';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'Twitter Clone | Search',
  description: 'Find tweets and connect with people 🔍',

  openGraph: {
    title: 'Twitter Clone | Search',
    description: 'Find tweets and connect with people 🔍',
    url: `${BASE_URL}/search`,
    siteName: 'Twitter Clone',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: `${BASE_URL}/images/og-image.webp`,
        width: 1200,
        height: 630,
        alt: 'Twitter Clone Search',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Search on Twitter Clone',
    description: 'Find tweets and connect with people 🔍',
    images: [`${BASE_URL}/images/og-image.webp`],
  },
};

export default async function Explore({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; tab?: searchType }>;
}) {
  const { tab, query } = await searchParams;

  return <ExploreClient tab={tab} query={query} />;
}
