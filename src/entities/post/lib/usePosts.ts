'use client';

import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

import { createPostAction } from '@/features/add-tweet-button';
import { LikePost } from '@/features/like-buton/api';
import { deletePostAction } from '@/features/manage-post/api';

import { getAllPostsPaginated } from '../api';
import { CreatePostPayload, GetUserPostsPaginatedReturnType } from '../model';

export const usePosts = (userId: string) => {
  const queryClient = useQueryClient();
  const lastRef = useRef<HTMLDivElement | null>(null);

  const queryKey = ['posts', userId];
  const globalKey = ['posts', 'global'];

  const {
    data,
    hasNextPage,
    isFetchingNextPage: isLoadingMore,
    isLoading,
    error,
    isFetching,
    fetchNextPage,
  } = useInfiniteQuery<
    GetUserPostsPaginatedReturnType,
    Error,
    InfiniteData<GetUserPostsPaginatedReturnType>,
    typeof queryKey,
    string | null
  >({
    queryKey,
    queryFn: ({ pageParam }) => getAllPostsPaginated(pageParam ?? null, userId),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: null,
    staleTime: 5 * 60 * 1000,
  });

  const posts = data?.pages.flatMap((page) => page.posts) || [];

  useEffect(() => {
    if (!lastRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isLoadingMore) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(lastRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isLoadingMore]);

  const toggleLike = useMutation({
    mutationFn: LikePost,
    onMutate: async ({ userId, postId }) => {
      await queryClient.cancelQueries({ queryKey });
      await queryClient.cancelQueries({ queryKey: globalKey });

      const prevData = queryClient.getQueryData<typeof data>(queryKey);
      const prevGlobalData = queryClient.getQueryData<typeof data>(globalKey);

      const updatePostsData = (old: typeof data | undefined) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            posts: page.posts.map((post) =>
              post.id === postId
                ? {
                    ...post,
                    is_liked: !post.is_liked,
                    likes_count: post.is_liked
                      ? Math.max((post.likes_count || 0) - 1, 0)
                      : (post.likes_count || 0) + 1,
                  }
                : post,
            ),
          })),
        };
      };

      queryClient.setQueryData(queryKey, updatePostsData);

      if (userId !== 'global') {
        queryClient.setQueryData(globalKey, updatePostsData);
      }

      return { prevData, prevGlobalData };
    },
    onError: (_error, _variables, context) => {
      if (context?.prevData) {
        queryClient.setQueryData(queryKey, context.prevData);
      }
      if (context?.prevGlobalData && userId !== 'global') {
        queryClient.setQueryData(globalKey, context.prevGlobalData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
      if (userId !== 'global') {
        queryClient.invalidateQueries({ queryKey: globalKey });
      }
    },
  });

  const addPost = useMutation<
    unknown,
    Error,
    CreatePostPayload,
    { prevData: typeof data; prevGlobalData: typeof data }
  >({
    mutationFn: createPostAction,
    onMutate: async (newPost) => {
      await queryClient.cancelQueries({ queryKey });
      await queryClient.cancelQueries({ queryKey: globalKey });

      const prevData = queryClient.getQueryData<typeof data>(queryKey);
      const prevGlobalData = queryClient.getQueryData<typeof data>(globalKey);

      queryClient.setQueryData(queryKey, (old: typeof data | undefined) => {
        if (!old) {
          return {
            pages: [{ posts: [newPost], nextCursor: null }],
            pageParams: [null],
          };
        }
        return {
          ...old,
          pages: [
            { ...old.pages[0], posts: [newPost, ...old.pages[0].posts] },
            ...old.pages.slice(1),
          ],
          pageParams: old.pageParams,
        };
      });

      if (userId !== 'global') {
        queryClient.setQueryData(globalKey, (old: typeof data | undefined) => {
          if (!old) {
            return {
              pages: [{ posts: [newPost], nextCursor: null }],
              pageParams: [null],
            };
          }
          return {
            ...old,
            pages: [
              { ...old.pages[0], posts: [newPost, ...old.pages[0].posts] },
              ...old.pages.slice(1),
            ],
            pageParams: old.pageParams,
          };
        });
      }

      return { prevData, prevGlobalData };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: globalKey });
    },
    onError: (_error, _variables, context) => {
      if (context?.prevData) {
        queryClient.setQueryData(queryKey, context.prevData);
      }
      if (context?.prevGlobalData) {
        queryClient.setQueryData(globalKey, context.prevGlobalData);
      }
    },
  });

  const deletePost = useMutation<
    unknown,
    Error,
    string,
    { prevData: typeof data; prevGlobalData: typeof data }
  >({
    mutationFn: deletePostAction,
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey });
      await queryClient.cancelQueries({ queryKey: globalKey });

      const prevData = queryClient.getQueryData<typeof data>(queryKey);
      const prevGlobalData = queryClient.getQueryData<typeof data>(globalKey);

      queryClient.setQueryData(queryKey, (old: typeof data | undefined) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            posts: page.posts.filter((post) => post.id !== postId),
          })),
        };
      });

      if (userId !== 'global') {
        queryClient.setQueryData(globalKey, (old: typeof data | undefined) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              posts: page.posts.filter((post) => post.id !== postId),
            })),
          };
        });
      }

      return { prevData, prevGlobalData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: globalKey });
    },
    onError: (_error, _variables, context) => {
      if (context?.prevData) {
        queryClient.setQueryData(queryKey, context.prevData);
      }
      if (context?.prevGlobalData) {
        queryClient.setQueryData(globalKey, context.prevGlobalData);
      }
    },
  });

  return {
    posts,
    lastRef,
    hasNextPage,
    isLoadingMore,
    isLoading,
    isFetching,
    error,
    fetchNextPage,
    addPost: addPost,
    deletePost: deletePost,
    toggleLike: toggleLike,
  };
};
