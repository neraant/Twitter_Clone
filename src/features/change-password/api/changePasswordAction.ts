'use server';

import { createClient } from '@/shared/api/supabase/server';

import { checkCurrentPasswordAction } from './checkCurrentPasswordAction';

export const changePasswordWithEmailAction = async (
  currentPassword: string,
  newPassword: string,
) => {
  const supabase = await createClient();
  try {
    const isCorrectPassword = await checkCurrentPasswordAction(currentPassword);

    if (!isCorrectPassword) throw new Error('Current password is incorrect');

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw new Error('Password changing failure');

    return { success: true, message: 'Password successfully changed!' };
  } catch (error) {
    console.error(error);
    const errorMessage =
      error instanceof Error ? error.message : 'Password changing failure!';
    return { success: false, message: errorMessage };
  }
};

export const changePasswordWithGoogleAction = async (newPassword: string) => {
  const supabase = await createClient();
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !user.email) {
      throw new Error('User not found');
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw new Error('Failed to set password');

    return {
      success: true,
      message:
        'Password successfully set! You can now sign in with email and password.',
    };
  } catch (error) {
    console.error(error);
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to set password';
    return { success: false, message: errorMessage };
  }
};
