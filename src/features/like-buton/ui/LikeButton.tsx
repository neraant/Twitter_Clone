'use client';

import clsx from 'clsx';

import { useToast } from '@/shared/lib/toast';
import { LikeActiveIcon, LikeNonActiveIcon } from '@/shared/ui/icon';

import { LikePost } from '../api';
import styles from './LikeButton.module.scss';

type LikeButtonProps = {
  isActive: boolean;
  likeQuantity: string;
  userId: string;
  postId: string;
  isDisabled: boolean;
  likePost?: (postId: string) => void;
  unlikePost?: (postId: string) => void;
};

export const LikeButton = ({
  isActive,
  likeQuantity,
  userId,
  postId,
  likePost,
  unlikePost,
  isDisabled = false,
}: LikeButtonProps) => {
  const { showToast } = useToast();

  const handleLikePost = async () => {
    const newIsLiked = !isActive;

    if (newIsLiked) {
      likePost?.(postId);
    } else {
      unlikePost?.(postId);
    }

    try {
      const { success, message } = await LikePost({ userId, postId });

      if (success) {
        showToast('Success', message, 'success');
      }
    } catch (error) {
      if (newIsLiked) {
        unlikePost?.(postId);
      } else {
        likePost?.(postId);
      }

      console.error(error);
      if (typeof error === 'string') showToast('Error', error, 'error');
    }
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
