'use client';

import { useEffect, useState } from 'react';

import { POSTS_QUERY_KEYS, usePosts } from '@/entities/post/lib';
import { Post } from '@/entities/post/model';
import { PostCard } from '@/entities/post/ui/PostCard/ui/PostCard';

interface PostClientProps {
  post: Post;
  currentUserId: string;
}

export const PostClient = ({ post, currentUserId }: PostClientProps) => {
  const { posts } = usePosts(POSTS_QUERY_KEYS.GLOBAL);
  const [localPost, setLocalPost] = useState(post);

  useEffect(() => {
    const updated = posts.find((p) => p.id === post.id);
    if (updated) setLocalPost(updated);
  }, [posts, post.id]);

  return <PostCard post={localPost} currentUserId={currentUserId} isFirst />;
};
