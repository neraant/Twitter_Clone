'use server';

import { createClient } from '@/shared/api/supabase/server';

export const hasEmailProvider = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.identities) return false;

  return user.identities.some((identity) => identity.provider === 'email');
};

export const hasGoogleProvider = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user?.identities?.some((identity) => identity.provider === 'google');
};
