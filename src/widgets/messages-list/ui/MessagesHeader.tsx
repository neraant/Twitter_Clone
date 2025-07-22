import Image from 'next/image';
import Link from 'next/link';

import { routes } from '@/shared/config/routes';
import { BackButton } from '@/shared/ui/back-button';

import styles from './MessagesList.module.scss';

const defaultAvatar = '/images/user-avatar.webp';

type MessagesHeaderProps = {
  userName: string;
  senderUrl: string;
  senderId: string;
};

export const MessagesHeader = ({
  userName,
  senderUrl,
  senderId,
}: MessagesHeaderProps) => {
  return (
    <div className={styles.messagesHeaderWrapper}>
      <BackButton />

      <Link
        href={`${routes.app.profile}/${senderId}`}
        className={styles.profileLink}
        aria-label={`${userName} profile`}
      >
        <Image
          alt='sender avatar'
          width={50}
          height={50}
          src={senderUrl || defaultAvatar}
          className={styles.avatar}
        />

        <div className={styles.messageHeaderContent}>
          <p className={styles.messagesHeaderWrapperText}>{userName}</p>
          <p className={styles.messagesHeaderWrapperSubText}>Status</p>
        </div>
      </Link>
    </div>
  );
};
