import { ReactNode } from 'react';

import { BackButton } from '@/shared/ui/back-button';

import styles from './post.module.scss';

export default function PostLayout({ children }: { children: ReactNode }) {
  return (
    <section className={styles.postWrapper}>
      <div className={styles.postHeaderWrapper}>
        <BackButton />

        <h3 className={styles.postHeaderWrapperText}>Back</h3>
      </div>

      <div className={styles.postCardWrapper}>{children}</div>
    </section>
  );
}
