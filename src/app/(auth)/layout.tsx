import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

import { createClient } from '@/shared/api/supabase/server';
import { routes } from '@/shared/config/routes';
import { Footer } from '@/shared/ui/footer/';

import styles from './AuthLayout.module.scss';

export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    redirect(routes.app.home);
  }

  return (
    <div className={styles.wrapper}>
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  );
}
