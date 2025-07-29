'use server';

import { createClient } from '@/shared/api/supabase/server';

import { SEARCH_POSTS_LIMIT } from '../lib';

export const searchPosts = async (searchTerm: string) => {
  const supabase = await createClient();

  if (!searchTerm.trim()) return [];

  const { data, error } = await supabase
    .from('post_with_author_and_likes')
    .select(
      `
      id,
      content,
      created_at,
      author_name,
      author_avatar,
      image_urls,
      is_deleted,
      is_liked,
      likes_count
    `,
    )
    .eq('is_deleted', false)
    .or(`content.ilike.%${searchTerm}%,author_name.ilike.%${searchTerm}%`)
    .order('created_at', { ascending: false })
    .limit(SEARCH_POSTS_LIMIT);

  if (error) throw new Error('Failed search posts');

  return data;
};
