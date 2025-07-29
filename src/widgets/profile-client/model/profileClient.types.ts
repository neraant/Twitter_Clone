import { Post } from '@/entities/post';
import { User } from '@/entities/user';

export type ProfileStore = {
  user: User | null;
  tweets: Post[];
  currentUserId: string | null;
  isOwner: boolean;
  isInitialFollow: boolean;
  isEditModalOpen: boolean;

  setUser: (user: User) => void;
  setTweets: (tweets: Post[]) => void;
  setCurrentUserId: (id: string) => void;
  setIsOwner: (flag: boolean) => void;
  setIsInitialFollow: (flag: boolean) => void;

  openEditModal: () => void;
  closeEditModal: () => void;
  updateFollowersCount: (delta: number) => void;
  updateFollowingCount: (delta: number) => void;
};
