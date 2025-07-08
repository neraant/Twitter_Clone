'use server';

import { createClient } from '@/shared/api/supabase/server';

export const getCurrentUser = async () => {
  const supabase = await createClient();

  const {
    data: { user: authUser },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;
  if (!authUser) return null;

  const { data: user, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', authUser.id)
    .single();

  if (userError) throw userError;

  return user;
};
