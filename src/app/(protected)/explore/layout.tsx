import { ReactNode } from 'react';

import { BACK_TEXT } from '@/shared/lib/common';
import { BackButton } from '@/shared/ui/back-button';

import styles from './explore.module.scss';

export default function ExploreLayout({ children }: { children: ReactNode }) {
  return (
    <section className={styles.exploreWrapper}>
      <div className={styles.exploreHeaderWrapper}>
        <BackButton />

        <h3 className={styles.exploreHeaderWrapperText}>{BACK_TEXT}</h3>
      </div>

      {children}
    </section>
  );
}
