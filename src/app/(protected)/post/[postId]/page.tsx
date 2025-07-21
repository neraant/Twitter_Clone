import { Metadata } from 'next';

import { getPost } from '@/entities/post/api';
import { getCurrentUserAction } from '@/entities/user/api';
import { PostClient } from '@/widgets/post-client';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

type PageProps = {
  params: Promise<{
    postId: string;
  }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { postId } = await params;
  const post = await getPost(postId);

  if (!post) {
    return {
      title: 'Twitter Clone | Post not found',
      description: 'Sorry, this post does not exist.',
    };
  }

  const authorName = post.author_name || 'Unknown user';
  const description = post.content || 'Check out this post on Twitter Clone!';
  const images =
    post.image_urls && post.image_urls.length > 0
      ? post.image_urls.map((photo) => ({
          url: photo.startsWith('http') ? photo : `${BASE_URL}${photo}`,
          width: 1200,
          height: 675,
          alt: `Post image`,
        }))
      : [
          {
            url: `${BASE_URL}/images/og-image.webp`,
            width: 1200,
            height: 630,
            alt: 'Twitter Clone Default',
          },
        ];

  return {
    title: `Twitter Clone | Post by ${authorName}`,
    description: description,
    openGraph: {
      title: `Post by ${authorName}`,
      description: description,
      url: `${BASE_URL}/post/${postId}`,
      siteName: 'Twitter Clone',
      locale: 'en_US',
      type: 'article',
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title: `Post by ${authorName}`,
      description: description,
      images: images.map((img) => img.url),
    },
  };
}

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
