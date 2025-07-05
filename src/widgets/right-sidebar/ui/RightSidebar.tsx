import { SearchedPosts } from '@/widgets/searched-posts';
import { YouMightLike } from '@/widgets/you-might-like';

import { INFO_TEXT } from '../lib';
import styles from './RightSidebar.module.scss';

export const RightSidebar = () => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.content}>
        <SearchedPosts />

        <YouMightLike />

        <span className={styles.infoText}>{INFO_TEXT}</span>
      </div>
    </div>
  );
};
