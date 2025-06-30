import { createClient } from '@/shared/api/supabase/client';
import { routes } from '@/shared/config/routes';

export async function signInWithGoogle() {
  const supabase = createClient();
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}${routes.auth.callback}`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });
}
