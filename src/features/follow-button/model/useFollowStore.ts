import { create } from 'zustand';

interface FollowStore {
  loadingUsers: Set<string>;
  setUserLoading: (userId: string, isLoading: boolean) => void;
  isUserLoading: (userId: string) => boolean;
}

export const useFollowStore = create<FollowStore>((set, get) => ({
  loadingUsers: new Set(),

  setUserLoading: (userId, isLoading) =>
    set((state) => {
      const newLoading = new Set(state.loadingUsers);
      if (isLoading) newLoading.add(userId);
      else newLoading.delete(userId);
      return { loadingUsers: newLoading };
    }),

  isUserLoading: (userId) => get().loadingUsers.has(userId),
}));
