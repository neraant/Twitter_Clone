'use server';

import { createClient } from '@/shared/api/supabase/server';

export const getUserPostsPaginated = async (
  userId: string,
  cursor: string | null,
) => {
  try {
    const supabase = await createClient();
    const limit = 10;

    let query = supabase
      .from('post_with_author')
      .select('*')
      .eq('author_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (cursor) {
      query = query.lt('created_at', cursor);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(error.message);
    }

    const posts = data || [];

    return {
      data: posts,
      hasMore: posts.length === limit,
      nextCursor: posts.length > 0 ? posts[posts.length - 1].created_at : null,
    };
  } catch (error) {
    console.error('getUserPostsPaginated error:', error);
    throw error;
  }
};
