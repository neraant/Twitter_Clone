import { create } from 'zustand';

import { getUserTweets } from '../api';
import { PostsState } from './post.types';

export const usePostsStore = create<PostsState>((set) => ({
  posts: [],
  isLoading: true,
  error: null,

  fetchUserPosts: async ({ userId, limit, cursor }) => {
    set({ isLoading: true, error: null });
    try {
      const posts = await getUserTweets({ userId, limit, cursor });
      set({ posts, isLoading: false });
    } catch (error) {
      console.error(error);
      set({ error: 'Something went wrong', isLoading: false });
    }
  },
}));
