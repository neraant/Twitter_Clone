import clsx from 'clsx';
import Image from 'next/image';

import { formatTimeShort } from '@/shared/lib/common';

import styles from './Message.module.scss';

type MessageProps = {
  isIncoming: boolean;
  content: string;
  time: string;
  senderUrl: string;
  senderName: string;
};

const DefaultAvatar = '/images/user-avatar.webp';

export const MessageCard = ({
  isIncoming = false,
  content,
  time,
  senderUrl,
  senderName,
}: MessageProps) => {
  const formattedTime = formatTimeShort(time);

  return (
    <div className={clsx(styles.messageWrapper, isIncoming && styles.incoming)}>
      {isIncoming && (
        <Image
          src={senderUrl || DefaultAvatar}
          width={30}
          height={30}
          alt={senderName}
          className={styles.avatar}
        />
      )}

      <div className={styles.messageContent}>
        <p className={styles.messageText}>{content}</p>

        <div className={styles.messageFooter}>
          <span className={styles.messageTime}>{formattedTime}</span>
        </div>
      </div>
    </div>
  );
};
