import { createClient } from '@/shared/api/supabase/client';

export const searchPosts = async (searchTerm: string) => {
  const supabase = createClient();

  if (!searchTerm.trim()) return [];

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .ilike('content', `%${searchTerm}%`)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) throw new Error('Failed search');

  return data;
};
