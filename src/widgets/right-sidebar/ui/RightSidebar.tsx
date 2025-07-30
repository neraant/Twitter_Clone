import { Suspense } from 'react';

import { SearchedPosts } from '@/widgets/searched-posts';
import { YouMightLike, YouMightLikeSkeleton } from '@/widgets/you-might-like';

import { INFO_TEXT } from '../lib';
import styles from './RightSidebar.module.scss';

export const RightSidebar = () => {
  return (
    <div className={styles.sidebar} data-testid='right-sidebar'>
      <div className={styles.content}>
        <SearchedPosts />

        <Suspense fallback={<YouMightLikeSkeleton />}>
          <YouMightLike />
        </Suspense>

        <span className={styles.infoText}>{INFO_TEXT}</span>
      </div>
    </div>
  );
};
