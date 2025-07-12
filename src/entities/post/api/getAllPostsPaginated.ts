'use server';

import { createClient } from '@/shared/api/supabase/server';

import { GetUserPostsPaginatedReturnType } from '../model';

export const getAllPostsPaginated = async (
  cursor: string | null,
): Promise<GetUserPostsPaginatedReturnType> => {
  try {
    const supabase = await createClient();
    const limit = 10;

    let query = supabase
      .from('post_with_author_and_likes')
      .select('*')
      .eq('is_deleted', false)
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
    console.error('getAllPostsPaginated error:', error);
    throw error;
  }
};
