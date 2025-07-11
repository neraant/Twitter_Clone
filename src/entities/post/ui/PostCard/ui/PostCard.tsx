import Image from 'next/image';
import { useState } from 'react';

import { Post } from '@/entities/post/model';
import { LikeButton } from '@/features/like-buton';
import { ManagePost } from '@/features/manage-post';

import styles from './PostCard.module.scss';

const DEFAULT_AVATAR = '/images/user-avatar.png';
const LOCATION = 'en-US';

type PostCardProps = {
  post: Post;
  currentUserId: string;
  onPostDeleted?: () => void;
};

export const PostCard = ({
  post,
  currentUserId,
  onPostDeleted,
}: PostCardProps) => {
  const [localIsLiked, setLocalIsLiked] = useState(post.is_liked ?? false);
  const [localLikesCount, setLocalLikesCount] = useState(post.likes_count ?? 0);

  const handleLikeUpdate = (newIsLiked: boolean) => {
    setLocalIsLiked(newIsLiked);
    setLocalLikesCount((prev) => (newIsLiked ? prev + 1 : prev - 1));
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
      />

      <div className={styles.postContent}>
        <div className={styles.postHeader}>
          <div className={styles.postHeaderInfo}>
            <p className={styles.postAuthorName}>{author_name}</p>
            <p className={styles.postCreatedAt}>{formattedTime}</p>
          </div>

          {isOwner && (
            <ManagePost
              postId={postId}
              className={styles.managePost}
              onPostDeleted={onPostDeleted}
            />
          )}
        </div>
        <p className={styles.postContentText}>{content}</p>
        {image_urls && image_urls.length > 0 && (
          <div className={styles.postImages} data-count={imageCount}>
            {image_urls.map((src, index) => (
              <Image
                key={`${src}-${index}`}
                src={src}
                width={200}
                height={200}
                priority={index === 0}
                alt={`post image ${index + 1}`}
                className={styles.postImage}
              />
            ))}
          </div>
        )}

        <LikeButton
          isActive={localIsLiked}
          likeQuantity={localLikesCount?.toString()}
          userId={currentUserId}
          postId={postId}
          onLikeUpdate={handleLikeUpdate}
        />
      </div>
    </article>
  );
};
