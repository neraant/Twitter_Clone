import UserIcon from '@assets/images/user-avatar.png';
import Image from 'next/image';
import Link from 'next/link';

import styles from './PostSearchCard.module.scss';

type PostSearchCardProps = {
  avatar: string | null;
  name: string;
  content: string;
  href: string;
};

export const PostSearchCard = ({
  avatar,
  name,
  content,
  href,
}: PostSearchCardProps) => {
  return (
    <Link href={href} className={styles.postLink}>
      <Image
        className={styles.avatar}
        src={avatar ?? UserIcon}
        alt='avatar'
        width={50}
        height={50}
        aria-label='avatar'
        priority
      />

      <div className={styles.postInfo}>
        <span className={styles.name}>{name}</span>
        <span className={styles.content}>{content}</span>
      </div>
    </Link>
  );
};
