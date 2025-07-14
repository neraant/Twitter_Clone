import { Metadata } from 'next';

import { getPost } from '@/entities/post/api';
import { PostCard } from '@/entities/post/ui/PostCard/ui/PostCard';
import { getCurrentUserAction } from '@/entities/user/api';

export const metadata: Metadata = {
  title: 'Twitter Clone | Post',
  description: 'This is the post page',
};

export default async function Post({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;
  const post = await getPost(postId);

  const currentUser = await getCurrentUserAction();
  if (!currentUser) return null;

  return <PostCard post={post} currentUserId={currentUser.id} />;
}
