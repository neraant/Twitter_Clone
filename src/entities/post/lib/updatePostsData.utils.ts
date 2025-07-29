import { PostsQueryData } from '../model/post.types';

export const updatePostsData = ({
  oldData,
  postId,
}: {
  oldData: PostsQueryData;
  postId: string;
}): PostsQueryData => {
  if (!oldData) return oldData;

  return {
    ...oldData,
    pages: oldData.pages.map((page) => ({
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
