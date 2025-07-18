'use server';

import { createClient } from '@/shared/api/supabase/server';

export const deletePostAction = async (postId: string) => {
  const supabase = await createClient();

  const { error } = await supabase
    .from('posts')
    .update({ is_deleted: true })
    .eq('id', postId);

  if (error) {
    console.error(error);
    throw new Error('Post deleting failed');
  }
};
