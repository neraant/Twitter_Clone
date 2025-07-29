import { InfiniteData } from '@tanstack/react-query';

export type Post = {
  id?: string | null;
  author_id: string | null;
  content: string | null;
  image_urls: string[] | null;
  is_deleted: boolean | null;
  created_at?: string | null;
  image_hashes?: string[] | null;
  perceptual_hashes?: string[] | null;
  author_avatar?: string | null;
  author_name?: string | null;
  is_liked?: boolean | null;
  likes_count?: number | null;
};

export type GetUserPostsPaginatedReturnType = {
  posts: Post[];
  hasMore: boolean;
  nextCursor: string | null;
};

export interface CreatePostPayload {
  author_id: string;
  content: string;
  image_urls?: string[];
  image_hashes: string[];
  perceptual_hashes: string[];
}

export const enum PostFetchingMode {
  all = 'all',
  user = 'user',
}

export type PostsInfiniteQueryConfig = {
  TQueryFnData: GetUserPostsPaginatedReturnType;
  TError: Error;
  TData: InfiniteData<GetUserPostsPaginatedReturnType>;
  TQueryKey: readonly string[];
  TPageParam: string | null;
};

export type PostsQueryData = PostsInfiniteQueryConfig['TData'] | undefined;

export type ImagePreview = {
  id: string;
  file: File;
  url: string;
};
