import { Metadata } from 'next';

import { ExploreClient, searchType } from '@/widgets/explore-client';

export const metadata: Metadata = {
  title: 'Twitter Clone | Explore',
  description: 'This is the explore page',
};

export default async function Explore({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; tab?: searchType }>;
}) {
  const { tab, query } = await searchParams;

  return <ExploreClient tab={tab} query={query} />;
}
