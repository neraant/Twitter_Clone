export type Post = {
  id?: string | null;
  author_avatar: string | null;
  author_id: string | null;
  author_name: string | null;
  content: string | null;
  created_at: string | null;
  image_urls: string[] | null;
  is_deleted: boolean | null;
  is_liked: boolean | null;
  likes_count: number | null;
};

export type GetUserPostsPaginatedReturnType = {
  data: Post[];
  hasMore: boolean;
  nextCursor: string | null;
};

export type CreatePostPayload = {
  author_id: string;
  content: string;
  image_urls?: string[] | null;
};
