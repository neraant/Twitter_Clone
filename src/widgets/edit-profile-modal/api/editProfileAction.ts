'use server';

import { revalidateTag } from 'next/cache';

import { createClient } from '@/shared/api/supabase/server';

import { EditFormData } from '../lib';

export const editProfileAction = async (
  userId: string,
  formData: EditFormData,
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
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;

  revalidateTag(`user-${userId}`);
  return data;
};
