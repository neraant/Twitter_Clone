import { User } from '@/entities/user';
import { getCurrentUserAction } from '@/entities/user/api';
import { isFollowingAction } from '@/features/follow-button/api/followActions';

import { getYouMightLikeUsersAction } from '../api';
import { YouMightLikeClient } from './YouMightLikeClient';

export const YouMightLike = async () => {
  try {
    const user: User = await getCurrentUserAction();
    const users = await getYouMightLikeUsersAction(user.id);
    if (!users) return null;

    const usersWithFollowStatus = await Promise.all(
      users.map(async (targetUser) => {
        const isFollowed = await isFollowingAction(targetUser.id, user.id);
        return { ...targetUser, isFollowed };
      }),
    );

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
