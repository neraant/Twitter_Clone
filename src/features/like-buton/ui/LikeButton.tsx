import clsx from 'clsx';

import { PostFetchingMode } from '@/entities/post';
import { useToast } from '@/shared/lib/toast';
import { LikeActiveIcon, LikeNonActiveIcon } from '@/shared/ui/icon';
import { usePosts } from '@/widgets/posts-list/lib';

import { LikePost } from '../api';
import styles from './LikeButton.module.scss';

type LikeButtonProps = {
  isActive: boolean;
  likeQuantity: string;
  userId: string;
  postId: string;
  isDisabled: boolean;
  onLikeUpdate: (isLiked: boolean) => void;
};

export const LikeButton = ({
  isActive,
  likeQuantity,
  userId,
  postId,
  isDisabled = false,
  onLikeUpdate,
}: LikeButtonProps) => {
  const { showToast } = useToast();
  const { refreshPosts } = usePosts({ mode: PostFetchingMode.all });

  const handleLikePost = async () => {
    const newIsLiked = !isActive;
    onLikeUpdate(newIsLiked);

    try {
      const { success, message } = await LikePost({ userId, postId });

      if (success) {
        showToast('Success', message, 'success');
      }
    } catch (error) {
      onLikeUpdate(isActive);
      console.error(error);
      if (typeof error === 'string') showToast('Error', error, 'error');
    } finally {
      refreshPosts();
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
