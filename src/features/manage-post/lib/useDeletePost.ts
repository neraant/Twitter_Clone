'use client';

import { usePosts } from '@/entities/post/lib';
import { useToast } from '@/shared/lib/toast';

export const useDeletePost = (
  postId: string,
  currentUserId: string,
  onDelete: () => void,
) => {
  const { showToast } = useToast();
  const { deletePost } = usePosts(currentUserId);

  const handleDeletePost = async () => {
    try {
      await deletePost.mutateAsync(postId);
      onDelete();

      showToast('Success', 'The post has been successfully deleted', 'success');
    } catch (error) {
      if (typeof error === 'string') {
        showToast('Error', error, 'error');
      }
    }
  };

  return handleDeletePost;
};
