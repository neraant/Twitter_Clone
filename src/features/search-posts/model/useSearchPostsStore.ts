import { create } from 'zustand';

import { searchPosts } from '../api/searchPosts';
import { SearchState } from './searchPosts.types';

export const useSearchPostsStore = create<SearchState>((set) => ({
  query: '',
  results: [],
  isLoading: false,
  hasSearched: false,
  error: null,

  setQuery: (value) =>
    set({
      query: value,
      hasSearched: false,
      error: null,
    }),

  setLoading: (loading) => set({ isLoading: loading }),

  search: async (query) => {
    set({ isLoading: true, error: null });
    try {
      const results = await searchPosts(query);
      set({ results, isLoading: false, hasSearched: true });
    } catch (error) {
      console.error(error);
      set({
        error: 'Something went wrong',
        isLoading: false,
        hasSearched: true,
      });
    }
  },
}));
