import { ReactNode } from 'react';

import { Header } from '@/shared/ui/header';
import { LeftSidebar } from '@/widgets/left-sidebar';
import { RightSidebar } from '@/widgets/right-sidebar';

import styles from './ProtectedLayou.module.scss';

export default function ProtectedLayout({ children }: { children: ReactNode }) {
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
