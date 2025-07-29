'use client';

import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { Post } from '@/entities/post/model';
import { LikeButton } from '@/features/like-buton';
import { ManagePost } from '@/features/manage-post';
import { routes } from '@/shared/config/routes';
import { DEFAULT_AVATAR, formatTimeLong } from '@/shared/lib/common';
import { Skeleton } from '@/shared/ui/skeleton';

import styles from './PostCard.module.scss';
import { PostCardSkeleton } from './PostCardSkeleton';

type PostCardProps = {
  post: Post;
  currentUserId: string;
  isPreview?: boolean;
  isFirst?: boolean;
};

export const PostCard = ({
  post,
  currentUserId,
  isPreview = false,
  isFirst = false,
}: PostCardProps) => {
  const {
    id: postId,
    author_id,
    author_avatar,
    author_name,
    content,
    image_urls,
    created_at,
    likes_count,
    is_liked,
  } = post;

  const [loadingImages, setLoadingImages] = useState<boolean[]>(
    image_urls?.map(() => true) ?? [],
  );

  const onImageLoad = (index: number) => {
    setLoadingImages((prev) => {
      const updated = [...prev];
      updated[index] = false;
      return updated;
    });
  };

  if (!post || !postId) return <PostCardSkeleton />;

  const formattedTime = formatTimeLong(created_at || '');

  const imageCount = image_urls?.length || 0;
  const hasImages = image_urls && !!imageCount;

  const isOwner = currentUserId === author_id;

  return (
    <article className={styles.postCard}>
      <Link href={`${routes.app.profile}/${author_id}`}>
        <Image
          src={author_avatar ?? DEFAULT_AVATAR}
          alt='user avatar'
          width={50}
          height={50}
          className={styles.userIcon}
        />
      </Link>

      <div className={styles.postContent}>
        <div className={styles.postHeader}>
          <Link
            className={styles.postHeaderInfo}
            href={`${routes.app.profile}/${author_id}`}
          >
            <p className={styles.postAuthorName}>{author_name}</p>
            <p className={styles.postCreatedAt}>{formattedTime}</p>
          </Link>

          {isOwner && !isPreview && (
            <ManagePost
              postId={postId}
              currentUserId={currentUserId}
              className={styles.managePost}
            />
          )}
        </div>

        <Link href={`${routes.app.post}/${postId}`}>
          <p className={styles.postContentText}>{content}</p>

          {hasImages && (
            <div
              className={clsx(
                styles.postImages,
                image_urls.length === 1 && styles.singleImageWrapper,
              )}
              data-count={imageCount}
            >
              {image_urls.map((src, index) => (
                <div key={`${src}-${index}`} className={styles.imageWrapper}>
                  {loadingImages[index] && (
                    <Skeleton
                      className={clsx(
                        styles.imageSkeleton,
                        image_urls.length === 1 && styles.singleImageSkeleton,
                      )}
                    />
                  )}
                  <Image
                    src={src}
                    width={0}
                    height={0}
                    sizes='100vw'
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                    priority={isFirst}
                    alt={`post image ${index + 1}`}
                    onLoad={() => onImageLoad(index)}
                    className={clsx(
                      styles.postImage,
                      image_urls.length === 1 && styles.singleImage,
                      loadingImages[index] && styles.loading,
                    )}
                  />
                </div>
              ))}
            </div>
          )}
        </Link>

        <LikeButton
          isActive={!!is_liked}
          likeQuantity={likes_count?.toString() ?? '0'}
          userId={currentUserId}
          postId={postId}
          isDisabled={isPreview}
        />
      </div>
    </article>
  );
};
