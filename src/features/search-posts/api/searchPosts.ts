'use server';

import { createClient } from '@/shared/api/supabase/server';

export const searchPosts = async (searchTerm: string) => {
  const supabase = await createClient();

  if (!searchTerm.trim()) return [];

  const { data, error } = await supabase
    .from('post_with_author_and_likes')
    .select('*')
    .eq('is_deleted', false)
    .or(`content.ilike.%${searchTerm}%,author_name.ilike.%${searchTerm}%`)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) throw new Error('Failed search');

  return data;
};
