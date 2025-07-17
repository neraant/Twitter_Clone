'use client';

import clsx from 'clsx';

import { usePosts } from '@/entities/post/lib';
import { LikeActiveIcon, LikeNonActiveIcon } from '@/shared/ui/icon';

import styles from './LikeButton.module.scss';

type LikeButtonProps = {
  isActive: boolean;
  likeQuantity: string;
  userId: string;
  postId: string;
  isDisabled: boolean;
};

export const LikeButton = ({
  isActive,
  likeQuantity,
  userId,
  postId,
  isDisabled = false,
}: LikeButtonProps) => {
  const { toggleLike } = usePosts(userId);

  const handleLikePost = async () => {
    await toggleLike.mutateAsync({ userId, postId });
  };

  return (
    <button
      type='button'
      aria-label='like post'
      className={clsx(styles.likeButton, isActive && styles.active)}
      onClick={(e) => {
        e.stopPropagation();
        handleLikePost();
      }}
      disabled={isDisabled}
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
