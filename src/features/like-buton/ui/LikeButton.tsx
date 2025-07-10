import clsx from 'clsx';

import { LikeActiveIcon, LikeNonActiveIcon } from '@/shared/ui/icon';

import styles from './LikeButton.module.scss';

type LikeButtonProps = {
  isActive: boolean;
  likeQuantity: string;
};

export const LikeButton = ({ isActive, likeQuantity }: LikeButtonProps) => {
  return (
    <button
      type='button'
      aria-label='like post'
      className={clsx(styles.likeButton, isActive && styles.active)}
    >
      {isActive ? (
        <LikeActiveIcon width={24} height={24} className={styles.likeIcon} />
      ) : (
        <LikeNonActiveIcon width={24} height={24} className={styles.likeIcon} />
      )}
      <span className={styles.likeText}>{likeQuantity}</span>
    </button>
  );
};
