'use server';

import { createClient } from '@/shared/api/supabase/server';

import { User } from '../model';

export const getUserById = async (id: string): Promise<User | null> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;

  return data;
};
