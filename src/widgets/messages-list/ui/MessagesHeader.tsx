import Image from 'next/image';
import Link from 'next/link';

import { USER_CHAT } from '@/entities/user/lib';
import { routes } from '@/shared/config/routes';
import { BackButton } from '@/shared/ui/back-button';
import { BookmarkSolidIcon } from '@/shared/ui/icon';

import styles from './MessagesList.module.scss';

const defaultAvatar = '/images/user-avatar.webp';

type MessagesHeaderProps = {
  userName: string;
  senderUrl: string;
  senderId: string;
  isCurrentUserChat?: boolean;
};

export const MessagesHeader = ({
  userName,
  senderUrl,
  senderId,
  isCurrentUserChat = false,
}: MessagesHeaderProps) => {
  const chatName = isCurrentUserChat ? USER_CHAT : userName;
  return (
    <div className={styles.messagesHeaderWrapper}>
      <BackButton />

      <Link
        href={`${routes.app.profile}/${senderId}`}
        className={styles.profileLink}
        aria-label={`${userName} profile`}
      >
        {isCurrentUserChat ? (
          <div className={styles.currentUserChatAvatar}>
            <BookmarkSolidIcon width={32} height={32} />
          </div>
        ) : (
          <Image
            alt='sender avatar'
            width={50}
            height={50}
            src={senderUrl || defaultAvatar}
            className={styles.avatar}
          />
        )}

        <div className={styles.messageHeaderContent}>
          <p className={styles.messagesHeaderWrapperText}>{chatName}</p>
        </div>
      </Link>
    </div>
  );
};
