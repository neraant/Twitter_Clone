import { GetUserTweetsOptions, Post } from '@/entities/post';
import { createClient } from '@/shared/api/supabase/server';

export const getUserTweets = async ({
  userId,
  limit,
  cursor,
}: GetUserTweetsOptions): Promise<Post[]> => {
  const supabase = await createClient();

  let query = supabase
    .from('posts')
    .select('*')
    .eq('author_id', userId)
    .order('created_at', { ascending: false });

  if (cursor) {
    query = query.lt('created_at', cursor);
  }

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) throw error;

  return data;
};
