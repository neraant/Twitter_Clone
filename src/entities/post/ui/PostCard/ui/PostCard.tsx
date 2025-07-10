import Image from 'next/image';

import { Post } from '@/entities/post/model';
import { LikeButton } from '@/features/like-buton';

import styles from './PostCard.module.scss';

export type PostCardProps = Omit<Post, 'author_id' | 'id'>;

const DEFAULT_AVATAR = '/images/user-avatar.png';
const LOCATION = 'en-US';

export const PostCard = (post: PostCardProps) => {
  const { author_avatar, author_name, content, image_urls, created_at } = post;
  if (!post) return null;

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
          <p className={styles.postAuthorName}>{author_name}</p>
          <p className={styles.postCreatedAt}>{formattedTime}</p>
        </div>

        <p className={styles.postContentText}>{content}</p>

        {image_urls && image_urls.length > 0 && (
          <div className={styles.postImages} data-count={imageCount}>
            {image_urls.map((src, index) => (
              <Image
                key={src}
                src={src}
                width={200}
                height={200}
                alt={`post image ${index + 1}`}
                className={styles.postImage}
              />
            ))}
          </div>
        )}

        <LikeButton isActive={false} likeQuantity='10' />
      </div>
    </article>
  );
};
