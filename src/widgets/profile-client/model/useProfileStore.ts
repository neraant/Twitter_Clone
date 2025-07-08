import { create } from 'zustand';

import { ProfileStore } from './profileClient.types';

export const useProfileStore = create<ProfileStore>((set) => ({
  user: null,
  tweets: [],
  currentUserId: null,
  isOwner: false,
  isInitialFollow: false,
  isEditModalOpen: false,

  setUser: (user) => set({ user }),
  setTweets: (tweets) => set({ tweets }),
  setCurrentUserId: (id) => set({ currentUserId: id }),
  setIsOwner: (flag) => set({ isOwner: flag }),
  setIsInitialFollow: (flag) => set({ isInitialFollow: flag }),

  openEditModal: () => set({ isEditModalOpen: true }),
  closeEditModal: () => set({ isEditModalOpen: false }),
  updateFollowersCount: (delta) =>
    set((state) => {
      if (!state.user) return {};

      return {
        user: {
          ...state.user,
          followers_count: (state.user.followers_count || 0) + delta,
        },
      };
    }),
  updateFollowingCount: (delta) =>
    set((state) => {
      if (!state.user) return {};

      return {
        user: {
          ...state.user,
          following_count: (state.user.following_count || 0) + delta,
        },
      };
    }),
}));
