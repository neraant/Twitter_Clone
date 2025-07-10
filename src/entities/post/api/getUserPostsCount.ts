'use server';

import { createClient } from '@/shared/api/supabase/server';

export const getUserPostsCount = async (userId: string): Promise<number> => {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from('post_with_author')
    .select('*', { count: 'exact', head: true })
    .eq('author_id', userId);

  if (error) throw error;
  return count || 0;
};
