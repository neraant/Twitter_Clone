import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

import { createClient } from '@/shared/api/supabase/server';
import { routes } from '@/shared/config/routes';

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect(routes.auth.signUpMain);
  }

  return <main>{children}</main>;
}
