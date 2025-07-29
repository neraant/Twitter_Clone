import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';

import { routes } from '@/shared/config/routes';
import { DEFAULT_AVATAR } from '@/shared/lib/common';

import styles from './PostSearchCard.module.scss';

type PostSearchCardProps = {
  avatar: string | null | StaticImageData;
  name: string;
  content: string;
  postId: string;
};

export const PostSearchCard = ({
  avatar,
  name,
  content,
  postId,
}: PostSearchCardProps) => {
  return (
    <Link href={`${routes.app.post}/${postId}`} className={styles.postLink}>
      <Image
        className={styles.avatar}
        src={avatar || DEFAULT_AVATAR}
        alt='avatar'
        width={50}
        height={50}
        aria-label='avatar'
        priority
      />

      <div className={styles.postInfo}>
        <p className={styles.name}>{name}</p>
        <p className={styles.content}>{content}</p>
      </div>
    </Link>
  );
};
