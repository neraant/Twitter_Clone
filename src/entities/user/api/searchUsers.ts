'use server';

import { createClient } from '@/shared/api/supabase/server';

import { User } from '../model';

export const searchUsers = async (searchTerm: string): Promise<User[]> => {
  const supabase = await createClient();

  if (!searchTerm.trim()) return [];

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .or(`name.ilike.%${searchTerm}%,user_telegram.ilike.%${searchTerm}%`)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) throw new Error('Failed search users');

  return data;
};
