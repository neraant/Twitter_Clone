'use client';

import { CreatePostPayload, PostFetchingMode } from '@/entities/post';
import { usePosts } from '@/widgets/posts-list/lib';

import { createPostAction } from '../api';

export const useCreatePost = () => {
  const { refreshPosts } = usePosts({ mode: PostFetchingMode.all });

  const createPost = async (payload: CreatePostPayload) => {
    try {
      await createPostAction(payload);
      refreshPosts();
    } catch (error) {
      throw error;
    }
  };

  return createPost;
};
