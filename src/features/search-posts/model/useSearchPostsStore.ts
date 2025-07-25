import { create } from 'zustand';

import { searchPosts } from '../api/searchPosts';
import { SearchState } from './searchPosts.types';

export const useSearchPostsStore = create<SearchState>((set) => ({
  query: '',
  results: [],
  isLoading: false,
  error: null,

  setQuery: (value) => set({ query: value }),

  search: async (query) => {
    set({ isLoading: true, error: null });
    try {
      const results = await searchPosts(query);
      set({ results, isLoading: false });
    } catch (error) {
      console.error(error);
      set({ error: 'Something went wrong', isLoading: false });
    }
  },
}));
