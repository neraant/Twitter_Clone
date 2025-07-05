import { createClient } from '@/shared/api/supabase/client';

export const getYouMightLikeUsers = async (currentUserId: string) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .neq('id', currentUserId);

  if (error) throw error;

  const shuffled = data.sort(() => 0.5 - Math.random()).slice(0, 10);

  return shuffled;
};
