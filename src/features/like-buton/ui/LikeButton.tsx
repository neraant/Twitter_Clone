'use client';

import clsx from 'clsx';

import { POSTS_QUERY_KEYS, usePosts } from '@/entities/post/lib';
import { LikeActiveIcon, LikeNonActiveIcon } from '@/shared/ui/icon';

import styles from './LikeButton.module.scss';

type LikeButtonProps = {
  isActive: boolean;
  likeQuantity: string;
  userId: string;
  currentUserId: string;
  postId: string;
  isDisabled: boolean;
  isGlobal?: boolean;
};

export const LikeButton = ({
  isActive,
  likeQuantity,
  userId,
  currentUserId,
  postId,
  isDisabled = false,
  isGlobal = false,
}: LikeButtonProps) => {
  const { toggleLike } = usePosts(isGlobal ? POSTS_QUERY_KEYS.GLOBAL : userId);

  const handleLikePost = async () => {
    await toggleLike.mutateAsync({ userId: currentUserId, postId });
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
