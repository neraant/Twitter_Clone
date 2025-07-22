import Image from 'next/image';
import Link from 'next/link';

import { routes } from '@/shared/config/routes';
import { formatTimeShort } from '@/shared/lib/common';

import styles from './UserMessageCard.module.scss';

type UserSmallCardProps = {
  userId: string;
  userName: string;
  userAvatar: string;
  lastMessage?: string;
  lastMessageTime?: string;
};

const DefaultAvatar = '/images/user-avatar.webp';

export const UserMessageCard = ({
  userId,
  userName,
  userAvatar,
  lastMessage,
  lastMessageTime,
}: UserSmallCardProps) => {
  const formattesLastMessageTime = formatTimeShort(lastMessageTime || '');

  return (
    <Link
      href={`${routes.app.messages}/${userId}`}
      className={styles.userMessageCard}
    >
      <Image
        src={userAvatar || DefaultAvatar}
        alt='User Avatar'
        width={50}
        height={50}
        className={styles.avatar}
      />

      <div className={styles.userMessageCardInfo}>
        <p className={styles.userName}>{userName}</p>

        <div className={styles.messageInfo}>
          <p className={styles.lastMessage}>{lastMessage}</p>

          <span className={styles.divider}>·</span>

          <p className={styles.lastMessageTime}>{formattesLastMessageTime}</p>
        </div>
      </div>
    </Link>
  );
};
