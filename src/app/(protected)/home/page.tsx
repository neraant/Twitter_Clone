import { Metadata } from 'next';

import { getCurrentUserAction } from '@/entities/user/api';
import { HomeClient } from '@/widgets/home-client/ui/HomeClient';

export const metadata: Metadata = {
  title: 'Twitter Clone | Home',
  description: 'This is the home page',
};

export default async function Home() {
  const user = await getCurrentUserAction();
  if (!user) return null;

  return <HomeClient currentUser={user} />;
}
