'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Post } from '@/entities/post/model';
import { LikeButton } from '@/features/like-buton';
import { ManagePost } from '@/features/manage-post';
import { routes } from '@/shared/config/routes';
import { Skeleton } from '@/shared/ui/skeleton';

import styles from './PostCard.module.scss';

const DEFAULT_AVATAR = '/images/user-avatar.png';
const LOCATION = 'en-US';

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
  const router = useRouter();

  const [localIsLiked, setLocalIsLiked] = useState(post.is_liked ?? false);
  const [localLikesCount, setLocalLikesCount] = useState(post.likes_count ?? 0);
  const [loadingImages, setLoadingImages] = useState<boolean[]>(
    post?.image_urls?.map(() => true) ?? [],
  );

  const handleLikeUpdate = (newIsLiked: boolean) => {
    setLocalIsLiked(newIsLiked);
    setLocalLikesCount((prev) => (newIsLiked ? prev + 1 : prev - 1));
  };

  const handleCardClick = () => {
    if (isPreview) return;
    router.push(`${routes.app.post}/${post.id}`);
  };

  const onImageLoad = (index: number) => {
    setLoadingImages((prev) => {
      const updated = [...prev];
      updated[index] = false;
      return updated;
    });
  };

  const {
    id: postId,
    author_avatar,
    author_name,
    content,
    image_urls,
    created_at,
  } = post;
  if (!postId) return null;

  const formattedTime = created_at
    ? new Intl.DateTimeFormat(LOCATION, {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(created_at))
    : '';

  const imageCount = image_urls?.length || 0;

  const isOwner = currentUserId === post.author_id;

  return (
    <article className={styles.postCard}>
      <Image
        src={author_avatar ?? DEFAULT_AVATAR}
        alt='user avatar'
        width={50}
        height={50}
        className={styles.userIcon}
        onClick={handleCardClick}
      />

      <div className={styles.postContent}>
        <div className={styles.postHeader}>
          <div className={styles.postHeaderInfo} onClick={handleCardClick}>
            <p className={styles.postAuthorName}>{author_name}</p>
            <p className={styles.postCreatedAt}>{formattedTime}</p>
          </div>

          {isOwner && !isPreview && (
            <ManagePost postId={postId} className={styles.managePost} />
          )}
        </div>

        <p className={styles.postContentText} onClick={handleCardClick}>
          {content}
        </p>
        {image_urls && image_urls.length > 0 && (
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

        <LikeButton
          isActive={localIsLiked}
          likeQuantity={localLikesCount?.toString()}
          userId={currentUserId}
          postId={postId}
          onLikeUpdate={handleLikeUpdate}
          isDisabled={isPreview}
        />
      </div>
    </article>
  );
};
