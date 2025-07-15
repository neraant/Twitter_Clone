import { ReactNode } from 'react';

import { getCurrentUserAction } from '@/entities/user/api';
import { Header } from '@/shared/ui/header';
import { LeftSidebar } from '@/widgets/left-sidebar';
import { RightSidebar } from '@/widgets/right-sidebar';

import styles from './ProtectedLayou.module.scss';

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUserAction();
  if (!user) return null;

  return (
    <>
      <Header />
      <main className={styles.main}>
        <LeftSidebar />

        <div className={styles.content}>{children}</div>

        <RightSidebar />
      </main>
    </>
  );
}
