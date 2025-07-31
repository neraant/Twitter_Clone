import Image from 'next/image';
import Link from 'next/link';

import { routes } from '@/shared/config/routes';
import { formatTimeShort } from '@/shared/lib/common';
import { BookmarkSolidIcon } from '@/shared/ui/icon';

import { USER_CHAT } from '../../lib';
import styles from './UserMessageCard.module.scss';

type UserSmallCardProps = {
  userId: string;
  userName: string;
  userAvatar: string;
  lastMessage?: string;
  lastMessageTime?: string;
  isCurrentUserChat?: boolean;
};

const DefaultAvatar = '/images/user-avatar.webp';

export const UserMessageCard = ({
  userId,
  userName,
  userAvatar,
  lastMessage,
  lastMessageTime,
  isCurrentUserChat = false,
}: UserSmallCardProps) => {
  const formattesLastMessageTime = formatTimeShort(lastMessageTime || '');
  const chatName = isCurrentUserChat ? USER_CHAT : userName;

  return (
    <Link
      href={`${routes.app.messages}/${userId}`}
      className={styles.userMessageCard}
    >
      {isCurrentUserChat ? (
        <div className={styles.currentUserChatAvatar}>
          <BookmarkSolidIcon width={32} height={32} />
        </div>
      ) : (
        <Image
          src={userAvatar || DefaultAvatar}
          alt='User Avatar'
          width={50}
          height={50}
          className={styles.avatar}
        />
      )}

      <div className={styles.userMessageCardInfo}>
        <p className={styles.userName}>{chatName}</p>

        <div className={styles.messageInfo}>
          <p className={styles.lastMessage}>{lastMessage}</p>

          <span className={styles.divider}>·</span>

          <p className={styles.lastMessageTime}>{formattesLastMessageTime}</p>
        </div>
      </div>
    </Link>
  );
};
