export type Post = {
  author_avatar: string | null;
  author_id: string | null;
  author_name: string | null;
  content: string | null;
  created_at: string;
  id: string;
  image_url: string | null;
};

export type GetUserTweetsOptions = {
  userId: string;
  limit?: number;
  cursor?: string;
};

export type PostsState = {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
  fetchUserPosts: ({ userId, limit, cursor }: GetUserTweetsOptions) => void;
};
