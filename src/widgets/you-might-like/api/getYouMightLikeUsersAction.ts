import { createClient } from '@/shared/api/supabase/server';

export const getYouMightLikeUsersAction = async (currentUserId: string) => {
  const supabase = await createClient();

  const { data: following, error: followsError } = await supabase
    .from('follows')
    .select('following_id')
    .eq('follower_id', currentUserId);

  if (followsError) throw followsError;

  const followingIds = following.map((follow) => follow.following_id);

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .neq('id', currentUserId)
    .not('id', 'in', `(${followingIds.join(',')})`);

  if (error) throw error;

  const shuffled = data.sort(() => 0.5 - Math.random()).slice(0, 10);

  return shuffled;
};
