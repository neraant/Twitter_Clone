import { createClient as createServerClient } from '@/shared/api/supabase/server';

export const isFollowing = async (
  targetUserId: string,
  currentUserId: string,
): Promise<boolean> => {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('follows')
    .select('*')
    .eq('follower_id', currentUserId)
    .eq('following_id', targetUserId)
    .maybeSingle();

  if (error) throw new Error(error.message);

  return !!data;
};
