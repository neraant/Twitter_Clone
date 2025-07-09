import { create } from 'zustand';

interface FollowStore {
  followedUsers: Map<string, boolean>;
  followStatus: Record<string, boolean>;
  initializeFollowStatus: (userId: string, status: boolean) => void;
  setFollowStatus: (userId: string, isFollowed: boolean) => void;
  getFollowStatus: (userId: string, initialStatus: boolean) => boolean;
}

export const useFollowStore = create<FollowStore>((set, get) => ({
  followedUsers: new Map(),
  followStatus: {},

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
}));
