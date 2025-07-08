'use server';

import { revalidateTag } from 'next/cache';

import { createClient } from '@/shared/api/supabase/server';

import { EditFormData } from '../lib';

export const editProfileAction = async (
  userId: string,
  formData: EditFormData,
  avatar_url?: string | null,
  banner_url?: string | null,
) => {
  const { name, telegram, bio, gender } = formData;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('users')
    .update({
      name,
      user_telegram: telegram,
      bio,
      gender,
      avatar_url,
      banner_url,
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;

  revalidateTag('user-profile');
  revalidateTag(`user-${userId}`);

  return data;
};
