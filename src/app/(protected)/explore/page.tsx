import { Metadata } from 'next';

import { BASE_URL } from '@/shared/lib/common';
import { ExploreClient, searchType } from '@/widgets/explore-client';

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
        url: `${BASE_URL}/images/og-image.png`,
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
    images: [`${BASE_URL}/images/og-image.png`],
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
