import { isFollowing } from '@/features/follow-button/api/serverFollowApi';
import { createClient } from '@/shared/api/supabase/server';

import { getYouMightLikeUsers } from '../api';
import { YouMightLikeClient } from './YouMightLikeClient';

export const YouMightLike = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  try {
    const initialUsers = await getYouMightLikeUsers(user.id);

    const usersWithFollowStatus = await Promise.all(
      initialUsers.map(async (targetUser) => {
        const isFollowed = await isFollowing(targetUser.id, user.id);
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
