import { getCurrentUser } from '@/features/auth/api/getCurrentUser';

import { UserSmallCard } from './UserSmallCard';

export const UserSmallCardServer = async ({
  className,
}: {
  className?: string;
}) => {
  try {
    const user = await getCurrentUser();
    if (!user) return null;

    return <UserSmallCard user={user} className={className} isOwnProfile />;
  } catch (error) {
    console.error('Failed to load user:', error);
    return null;
  }
};
