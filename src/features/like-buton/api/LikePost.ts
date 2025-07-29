'use server';

import { createClient } from '@/shared/api/supabase/server';

export const LikePost = async ({
  userId,
  postId,
}: {
  userId: string;
  postId: string;
}) => {
  const supabase = await createClient();

  const { data: existingLike, error: checkError } = await supabase
    .from('likes')
    .select('*')
    .eq('user_id', userId)
    .eq('post_id', postId)
    .single();

  if (checkError && checkError.code !== 'PGRST116') {
    console.error('Check like error:', checkError);
    throw new Error('Could not check existing like');
  }

  if (existingLike) {
    const { error: unlikeError } = await supabase
      .from('likes')
      .delete()
      .eq('user_id', userId)
      .eq('post_id', postId);

    if (unlikeError) {
      console.error('Unlike error:', unlikeError);
      throw new Error('Could not unlike post');
    }

    return { success: true, message: 'Unliked successfully' };
  }

  const { error: insertError } = await supabase.from('likes').insert({
    user_id: userId,
    post_id: postId,
  });

  if (insertError) {
    console.error('Insert like error:', insertError);
    throw new Error('Could not like post');
  }

  return { success: true, message: 'Liked successfully' };
};
