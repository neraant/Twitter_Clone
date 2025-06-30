import { redirect } from 'next/navigation';

import { createClient } from '@/shared/api/supabase/server';
import { routes } from '@/shared/config/routes';

export default async function RootPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect(routes.app.home);
  } else {
    redirect(routes.auth.signUpMain);
  }
}
