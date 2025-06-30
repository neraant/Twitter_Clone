import { createClient } from '@/shared/api/supabase/client';

import { LoginCredentials } from '../model/';

export async function loginWithPassword(credentials: LoginCredentials) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });

  if (error) throw error;

  return { data };
}
