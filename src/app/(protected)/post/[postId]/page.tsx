import { Metadata } from 'next';

import { getPost } from '@/entities/post/api';
import { getCurrentUserAction } from '@/entities/user/api';
import { PostClient } from '@/widgets/post-client';

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

  return <PostClient post={post} currentUserId={currentUser.id} />;
}
