import { createClient as createClientSide } from '@/shared/api/supabase/client';

export const followUser = async (
  targetUserId: string,
  currentUserId: string,
): Promise<void> => {
  const supabase = createClientSide();

  const { error } = await supabase
    .from('follows')
    .upsert([{ follower_id: currentUserId, following_id: targetUserId }], {
      onConflict: 'follower_id,following_id',
      ignoreDuplicates: false,
    });

  if (error) throw new Error(error.message);

  await supabase.rpc('increment_followers_count', {
    target_user_id: targetUserId,
  });
  await supabase.rpc('increment_following_count', {
    current_user_id: currentUserId,
  });
};

export const unfollowUser = async (
  targetUserId: string,
  currentUserId: string,
): Promise<void> => {
  const supabase = createClientSide();

  const { error } = await supabase
    .from('follows')
    .delete()
    .eq('follower_id', currentUserId)
    .eq('following_id', targetUserId);

  if (error) throw new Error(error.message);

  await supabase.rpc('decrement_followers_count', {
    target_user_id: targetUserId,
  });
  await supabase.rpc('decrement_following_count', {
    current_user_id: currentUserId,
  });
};
