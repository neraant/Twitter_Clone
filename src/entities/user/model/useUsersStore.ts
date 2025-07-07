import { create } from 'zustand';

import { getYouMightLikeUsers } from '../api';
import { UsersState } from './user.types';

export const useUsersStore = create<UsersState>((set) => ({
  users: [],
  user: null,
  isLoading: true,
  error: null,

  fetchUsers: async (currentUserId) => {
    set({ isLoading: true, error: null });
    try {
      const users = await getYouMightLikeUsers(currentUserId);
      set({ users, isLoading: false });
    } catch (error) {
      console.error(error);
      set({ error: 'Something went wrong', isLoading: false });
    }
  },
}));
