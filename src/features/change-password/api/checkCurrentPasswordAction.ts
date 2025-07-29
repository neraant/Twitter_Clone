'use server';

import { createClient } from '@/shared/api/supabase/server';

export const checkCurrentPasswordAction = async (
  currentPassword: string,
): Promise<boolean> => {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !user.email) throw new Error('Password changing error');

    const { error } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

    if (error) return false;

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
