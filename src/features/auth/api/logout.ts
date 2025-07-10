'use server';

import { createClient } from '@/shared/api/supabase/server';

export async function logout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Logout error:', error.message);
    throw new Error('Logout failed');
  }
}
