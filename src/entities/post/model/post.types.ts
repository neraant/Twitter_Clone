export type Post = {
  id?: string | null;
  author_avatar?: string | null;
  author_name?: string | null;
  author_id: string | null;
  content: string | null;
  created_at: string | null;
  image_urls: string[] | null;
};

export type GetUserTweetsOptions = {
  userId: string;
  limit?: number;
  cursor?: string;
};

export type CreatePostPayload = {
  author_id: string;
  content: string;
  image_urls?: string[] | null;
};
