import { getCurrentUserAction } from '../../api';
import { UserSmallCard } from './UserSmallCard';

export const UserSmallCardServer = async ({
  className,
}: {
  className?: string;
}) => {
  try {
    const user = await getCurrentUserAction();
    if (!user) return null;

    return <UserSmallCard user={user} className={className} isOwnProfile />;
  } catch (error) {
    console.error('Failed to load user:', error);
    return null;
  }
};
