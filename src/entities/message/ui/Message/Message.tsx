import clsx from 'clsx';
import Image from 'next/image';

import { formatTimeShort } from '@/shared/lib/common';
import { CheckDoubleIcon, CheckIcon } from '@/shared/ui/icon';

import styles from './Message.module.scss';

type MessageProps = {
  isIncoming: boolean;
  content: string;
  time: string;
  senderUrl: string;
  senderName: string;
  isRead: boolean;
  showReadStatus: boolean;
};

const DefaultAvatar = '/images/user-avatar.webp';

export const MessageCard = ({
  isIncoming = false,
  content,
  time,
  senderUrl,
  senderName,
  isRead = false,
  showReadStatus = false,
}: MessageProps) => {
  const formattedTime = formatTimeShort(time);

  const renderReadStatus = () => {
    if (!showReadStatus) return null;

    return (
      <span className={styles.readStatus}>
        {isRead ? (
          <CheckDoubleIcon width={12} height={12} className={styles.readIcon} />
        ) : (
          <CheckIcon width={12} height={12} className={styles.sentIcon} />
        )}
      </span>
    );
  };

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
          {renderReadStatus()}
        </div>
      </div>
    </div>
  );
};
