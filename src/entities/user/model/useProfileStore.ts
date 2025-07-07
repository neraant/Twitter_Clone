import { create } from 'zustand';

import { getUserById } from '../api';
import { ProfileState } from './user.types';

export const useProfileStore = create<ProfileState>((set) => ({
  profileUser: null,
  isLoading: false,
  error: null,

  fetchProfileUser: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const user = await getUserById(id);
      set({ profileUser: user, isLoading: false });
    } catch (error) {
      console.error(error);
      set({ error: 'Failed to load profile', isLoading: false });
    }
  },

  incrementFollowers: () =>
    set((state) => {
      if (!state.profileUser) return {};
      return {
        profileUser: {
          ...state.profileUser,
          followers_count: state.profileUser.followers_count + 1,
        },
      };
    }),

  decrementFollowers: () =>
    set((state) => {
      if (!state.profileUser) return {};
      return {
        profileUser: {
          ...state.profileUser,
          followers_count: state.profileUser.followers_count - 1,
        },
      };
    }),

  incrementFollowing: () =>
    set((state) => {
      if (!state.profileUser) return {};
      return {
        profileUser: {
          ...state.profileUser,
          following_count: state.profileUser.following_count + 1,
        },
      };
    }),

  decrementFollowing: () =>
    set((state) => {
      if (!state.profileUser) return {};
      return {
        profileUser: {
          ...state.profileUser,
          following_count: state.profileUser.following_count - 1,
        },
      };
    }),

  resetProfile: () => set({ profileUser: null, error: null, isLoading: false }),
}));
