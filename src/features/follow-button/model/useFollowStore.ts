import { create } from 'zustand';

interface FollowStore {
  followedUsers: Map<string, boolean>;
  followStatus: Record<string, boolean>;
  loadingUsers: Set<string>;
  initializeFollowStatus: (userId: string, status: boolean) => void;
  setFollowStatus: (userId: string, isFollowed: boolean) => void;
  getFollowStatus: (userId: string, initialStatus: boolean) => boolean;
  setUserLoading: (userId: string, isLoading: boolean) => void;
  isUserLoading: (userId: string) => boolean;
}

export const useFollowStore = create<FollowStore>((set, get) => ({
  followedUsers: new Map(),
  followStatus: {},
  loadingUsers: new Set(),

  initializeFollowStatus: (userId: string, status: boolean) => {
    const state = get();
    if (!state.followedUsers.has(userId)) {
      set((state) => ({
        followedUsers: new Map(state.followedUsers).set(userId, status),
        followStatus: { ...state.followStatus, [userId]: status },
      }));
    }
  },

  setFollowStatus: (userId: string, isFollowed: boolean) =>
    set((state) => ({
      followedUsers: new Map(state.followedUsers).set(userId, isFollowed),
      followStatus: { ...state.followStatus, [userId]: isFollowed },
    })),

  getFollowStatus: (userId: string, initialStatus: boolean) => {
    const state = get();
    return state.followedUsers.has(userId)
      ? state.followedUsers.get(userId)!
      : initialStatus;
  },

  setUserLoading: (userId: string, isLoading: boolean) =>
    set((state) => {
      const newLoadingUsers = new Set(state.loadingUsers);
      if (isLoading) {
        newLoadingUsers.add(userId);
      } else {
        newLoadingUsers.delete(userId);
      }
      return {
        loadingUsers: newLoadingUsers,
      };
    }),

  isUserLoading: (userId: string) => {
    const state = get();
    return state.loadingUsers.has(userId);
  },
}));
