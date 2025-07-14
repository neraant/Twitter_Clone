import { Metadata } from 'next';

import { ExploreClient } from '@/widgets/explore-client';

export const metadata: Metadata = {
  title: 'Twitter Clone | Explore',
  description: 'This is the explore page',
};

export default async function Explore() {
  return <ExploreClient />;
}
