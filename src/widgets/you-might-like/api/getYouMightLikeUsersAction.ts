import { createClient } from '@/shared/api/supabase/server';

export const getYouMightLikeUsersAction = async (currentUserId: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .neq('id', currentUserId);

  if (error) throw error;

  const shuffled = data.sort(() => 0.5 - Math.random()).slice(0, 10);

  return shuffled;
};
