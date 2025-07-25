export interface User {
  avatar_url: string | null;
  created_at: string;
  date_of_birth: string | null;
  email: string | null;
  followers_count: number;
  following_count: number;
  id: string;
  name: string | null;
  phone_number: string | null;
  updated_at: string | null;
}

export type UsersState = {
  users: User[];
  isLoading: boolean;
  error: string | null;
  fetchUsers: (currentUserId: string) => void;
};
