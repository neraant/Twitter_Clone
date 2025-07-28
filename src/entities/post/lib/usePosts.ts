'use client';

import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { createPostAction } from '@/features/add-tweet-button';
import { LikePost } from '@/features/like-buton/api';
import { deletePostAction } from '@/features/manage-post/api';
import { useInfiniteScroll } from '@/shared/lib/hooks/useInfiniteScroll';

import { getAllPostsPaginated } from '../api';
import {
  CreatePostPayload,
  PostsInfiniteQueryConfig,
  PostsQueryData,
} from '../model';
import { FIVE_MINUTES_IN_MS, POSTS_QUERY_KEYS } from './post.constants';
import { updatePostsData } from './updatePostsData.utils';

export const usePosts = (userId: string) => {
  const queryClient = useQueryClient();

  const queryKey: PostsInfiniteQueryConfig['TQueryKey'] = [
    POSTS_QUERY_KEYS.POSTS,
    userId,
  ];
  const globalKey: PostsInfiniteQueryConfig['TQueryKey'] = [
    POSTS_QUERY_KEYS.POSTS,
    POSTS_QUERY_KEYS.GLOBAL,
  ];

  const {
    data,
    hasNextPage,
    isFetchingNextPage: isLoadingMore,
    isLoading,
    error,
    isFetching,
    fetchNextPage,
  } = useInfiniteQuery<
    PostsInfiniteQueryConfig['TQueryFnData'],
    PostsInfiniteQueryConfig['TError'],
    PostsInfiniteQueryConfig['TData'],
    PostsInfiniteQueryConfig['TQueryKey'],
    PostsInfiniteQueryConfig['TPageParam']
  >({
    queryKey,
    queryFn: ({ pageParam }) => getAllPostsPaginated(pageParam ?? null, userId),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: null,
    staleTime: FIVE_MINUTES_IN_MS,
  });

  const posts = data?.pages.flatMap((page) => page.posts) || [];

  const { lastElementRef } = useInfiniteScroll({
    hasNextPage,
    isLoadingMore,
    fetchNextPage,
    threshold: 0.1,
  });

  const toggleLike = useMutation({
    mutationFn: LikePost,
    onMutate: async ({ userId, postId }) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey }),
        queryClient.cancelQueries({ queryKey: globalKey }),
      ]);

      const prevData = queryClient.getQueryData<PostsQueryData>(queryKey);
      const prevGlobalData =
        queryClient.getQueryData<PostsQueryData>(globalKey);

      queryClient.setQueryData(queryKey, (old: PostsQueryData) =>
        updatePostsData({ oldData: old, postId }),
      );

      if (userId !== POSTS_QUERY_KEYS.GLOBAL) {
        queryClient.setQueryData(globalKey, (old: PostsQueryData) =>
          updatePostsData({ oldData: old, postId }),
        );
      }

      return { prevData, prevGlobalData };
    },
    onError: (_error, _variables, context) => {
      if (context?.prevData) {
        queryClient.setQueryData(queryKey, context.prevData);
      }
      if (context?.prevGlobalData && userId !== POSTS_QUERY_KEYS.GLOBAL) {
        queryClient.setQueryData(globalKey, context.prevGlobalData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
      if (userId !== POSTS_QUERY_KEYS.GLOBAL) {
        queryClient.invalidateQueries({ queryKey: globalKey });
      }
    },
  });

  const addPost = useMutation<
    unknown,
    Error,
    CreatePostPayload,
    { prevData: PostsQueryData; prevGlobalData: PostsQueryData }
  >({
    mutationFn: createPostAction,
    onMutate: async (newPost) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey }),
        queryClient.cancelQueries({ queryKey: globalKey }),
      ]);

      const prevData = queryClient.getQueryData<PostsQueryData>(queryKey);
      const prevGlobalData =
        queryClient.getQueryData<PostsQueryData>(globalKey);

      queryClient.setQueryData(queryKey, (old: PostsQueryData | undefined) => {
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

      if (userId !== POSTS_QUERY_KEYS.GLOBAL) {
        queryClient.setQueryData(
          globalKey,
          (old: PostsQueryData | undefined) => {
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
          },
        );
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
    { prevData: PostsQueryData; prevGlobalData: PostsQueryData }
  >({
    mutationFn: deletePostAction,
    onMutate: async (postId) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey }),
        queryClient.cancelQueries({ queryKey: globalKey }),
      ]);

      const prevData = queryClient.getQueryData<PostsQueryData>(queryKey);
      const prevGlobalData =
        queryClient.getQueryData<PostsQueryData>(globalKey);

      queryClient.setQueryData(queryKey, (old: PostsQueryData | undefined) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            posts: page.posts.filter((post) => post.id !== postId),
          })),
        };
      });

      if (userId !== POSTS_QUERY_KEYS.GLOBAL) {
        queryClient.setQueryData(
          globalKey,
          (old: PostsQueryData | undefined) => {
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
    lastRef: lastElementRef,
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
