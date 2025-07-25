import { User } from '@/entities/user';
import { createClient } from '@/shared/api/supabase/server';

export const getCurrentUser = async (): Promise<User | null> => {
  const supabase = await createClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (authUser) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (error) throw error;

    return data;
  }

  return null;
};
