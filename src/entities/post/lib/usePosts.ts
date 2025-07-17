'use client';

import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

import { createPostAction } from '@/features/add-tweet-button';
import { deletePostAction } from '@/features/manage-post/api';

import { getAllPostsPaginated } from '../api';
import { CreatePostPayload, GetUserPostsPaginatedReturnType } from '../model';

export const usePosts = (userId?: string) => {
  const queryClient = useQueryClient();
  const lastRef = useRef<HTMLDivElement | null>(null);

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
    ['posts', string | undefined],
    string | null
  >({
    queryKey: ['posts', userId],
    queryFn: ({ pageParam }) => getAllPostsPaginated(pageParam ?? null, userId),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: null,
    staleTime: 0,
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

  const likePost = (postId: string) => {
    queryClient.setQueryData(['posts', userId], (oldData: typeof data) => {
      if (!oldData) return oldData;

      return {
        ...oldData,
        pages: oldData.pages.map((page) => ({
          ...page,
          posts: page.posts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  likes_count: (post.likes_count || 0) + 1,
                  is_liked: true,
                }
              : post,
          ),
        })),
      };
    });
  };

  const unlikePost = (postId: string) => {
    queryClient.setQueryData(['posts', userId], (oldData: typeof data) => {
      if (!oldData) return oldData;

      return {
        ...oldData,
        pages: oldData.pages.map((page) => ({
          ...page,
          posts: page.posts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  likes_count: Math.max(0, (post.likes_count || 0) - 1),
                  is_liked: false,
                }
              : post,
          ),
        })),
      };
    });
  };

  const addPost = useMutation<
    unknown,
    Error,
    CreatePostPayload,
    { prevData: InfiniteData<GetUserPostsPaginatedReturnType> | undefined }
  >({
    mutationFn: createPostAction,
    onMutate: async (newPost) => {
      await queryClient.cancelQueries({ queryKey: ['posts', userId] });

      const prevData = queryClient.getQueryData<
        InfiniteData<GetUserPostsPaginatedReturnType>
      >(['posts', userId]);

      queryClient.setQueryData(
        ['posts', userId],
        (old: InfiniteData<GetUserPostsPaginatedReturnType> | undefined) => {
          if (!old) {
            return {
              pages: [
                {
                  posts: [newPost],
                  nextCursor: null,
                },
              ],
              pageParams: [null],
            };
          }

          return {
            ...old,
            pages: [
              {
                ...old.pages[0],
                posts: [newPost, ...old.pages[0].posts],
              },
              ...old.pages.slice(1),
            ],
            pageParams: old.pageParams,
          };
        },
      );

      return { prevData };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error, variables, context) => {
      if (context?.prevData) {
        queryClient.setQueryData(['posts', userId], context.prevData);
      }
    },
  });

  const deletePost = useMutation<
    unknown,
    Error,
    string,
    { prevData: InfiniteData<GetUserPostsPaginatedReturnType> | undefined }
  >({
    mutationFn: deletePostAction,
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ['posts', userId] });

      const prevData = queryClient.getQueryData<
        InfiniteData<GetUserPostsPaginatedReturnType>
      >(['posts', userId]);

      queryClient.setQueryData(
        ['posts', userId],
        (old: InfiniteData<GetUserPostsPaginatedReturnType> | undefined) => {
          if (!old) return old;

          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              posts: page.posts.filter((post) => post.id !== postId),
            })),
          };
        },
      );

      return { prevData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error, variables, context) => {
      if (context?.prevData) {
        queryClient.setQueryData(['posts', userId], context.prevData);
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
    addPost,
    deletePost,
    fetchNextPage,
    likePost,
    unlikePost,
  };
};
