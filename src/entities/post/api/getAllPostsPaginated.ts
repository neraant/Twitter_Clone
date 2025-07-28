'use server';

import { createClient } from '@/shared/api/supabase/server';

import { POSTS_LIMIT, POSTS_QUERY_KEYS } from '../lib';
import { GetUserPostsPaginatedReturnType } from '../model';

export const getAllPostsPaginated = async (
  cursor: string | null,
  userId?: string,
): Promise<GetUserPostsPaginatedReturnType> => {
  try {
    const supabase = await createClient();
    const limit = POSTS_LIMIT;

    let query = supabase
      .from('post_with_author_and_likes')
      .select('*')
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (userId && userId !== POSTS_QUERY_KEYS.GLOBAL) {
      query = query.eq('author_id', userId);
    }

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
      posts,
      hasMore: posts.length === limit,
      nextCursor: posts.length > 0 ? posts[posts.length - 1].created_at : null,
    };
  } catch (error) {
    console.error('getAllPostsPaginated error:', error);
    throw error;
  }
};
