import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

import { createClient } from '@/shared/api/supabase/server';
import { routes } from '@/shared/config/routes';
import { Header } from '@/shared/ui/header';
import { LeftSidebar } from '@/widgets/left-sidebar';
import { RightSidebar } from '@/widgets/right-sidebar';

import styles from './ProtectedLayou.module.scss';

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

  return (
    <>
      <Header />
      <main className={styles.main}>
        <LeftSidebar />
        {children}
        <RightSidebar />
      </main>
    </>
  );
}
