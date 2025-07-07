import { createClient } from '@/shared/api/supabase/client';

import { EditFormData } from '../lib';

export const editProfile = async (userId: string, formData: EditFormData) => {
  const { name, telegram, bio, gender } = formData;
  const supabase = createClient();

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

  return data;
};
