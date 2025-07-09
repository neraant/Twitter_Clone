'use server';

import { revalidateTag } from 'next/cache';

import { createClient } from '@/shared/api/supabase/server';

export const followUserAction = async (
  targetUserId: string,
  currentUserId: string,
): Promise<{ success: boolean; error?: string }> => {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user || user.id !== currentUserId) {
      return { success: false, error: 'Unauthorized' };
    }

    const { error: followError } = await supabase
      .from('follows')
      .upsert([{ follower_id: currentUserId, following_id: targetUserId }], {
        onConflict: 'follower_id,following_id',
        ignoreDuplicates: false,
      });

    if (followError) throw new Error(followError.message);

    await supabase.rpc('increment_followers_count', {
      target_user_id: targetUserId,
    });
    await supabase.rpc('increment_following_count', {
      current_user_id: currentUserId,
    });

    revalidateTag(`user-${targetUserId}`);
    revalidateTag('user-profile');

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

export const unfollowUserAction = async (
  targetUserId: string,
  currentUserId: string,
): Promise<{ success: boolean; error?: string }> => {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user || user.id !== currentUserId) {
      return { success: false, error: 'Unauthorized' };
    }

    const { error: unfollowError } = await supabase
      .from('follows')
      .delete()
      .eq('follower_id', currentUserId)
      .eq('following_id', targetUserId);

    if (unfollowError) throw new Error(unfollowError.message);

    await supabase.rpc('decrement_followers_count', {
      target_user_id: targetUserId,
    });
    await supabase.rpc('decrement_following_count', {
      current_user_id: currentUserId,
    });

    revalidateTag(`user-${targetUserId}`);
    revalidateTag('user-profile');

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

export const isFollowingAction = async (
  targetUserId: string,
  currentUserId: string,
): Promise<boolean> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('follows')
    .select('*')
    .eq('follower_id', currentUserId)
    .eq('following_id', targetUserId)
    .maybeSingle();

  if (error) throw new Error(error.message);

  return !!data;
};
