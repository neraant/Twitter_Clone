import { createClient } from '@/shared/api/supabase/client';
import { routes } from '@/shared/config/routes';

export async function signInWithGoogle() {
  const supabase = createClient();
  const redirectUrl = `${window.location.origin}${routes.api.callback}`;

  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });
}
