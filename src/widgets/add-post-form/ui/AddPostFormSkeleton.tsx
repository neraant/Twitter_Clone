import { Skeleton } from '@/shared/ui/skeleton';

import styles from './AddPostForm.module.scss';

export const AddPostFormSkeleton = () => {
  return (
    <div className={styles.form}>
      <Skeleton
        width='50px'
        height='50px'
        className={styles.avatarIcon}
        radius='50%'
      />

      <Skeleton className={styles.content} height='145px' />
    </div>
  );
};
