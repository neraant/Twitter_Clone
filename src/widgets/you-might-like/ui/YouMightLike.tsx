import { User } from '@/entities/user';
import { getCurrentUserAction } from '@/entities/user/api';

import { getYouMightLikeUsersAction } from '../api';
import { YouMightLikeClient } from './YouMightLikeClient';

export const YouMightLike = async () => {
  try {
    const user: User | null = await getCurrentUserAction();
    if (!user) return null;

    const users = await getYouMightLikeUsersAction(user.id);
    if (!users) return null;

    const usersWithFollowStatus = users.map((targetUser) => ({
      ...targetUser,
      isFollowed: false,
    }));

    return (
      <YouMightLikeClient
        initialUsers={usersWithFollowStatus}
        currentUserId={user.id}
      />
    );
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return <YouMightLikeClient isError={true} />;
  }
};
