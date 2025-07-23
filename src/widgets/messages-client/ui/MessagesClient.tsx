import { useMemo } from 'react';

import { ChatRoom } from '@/entities/message';
import { UserMessageCard } from '@/entities/user';

import { MESSAGES_TITLE } from '../lib';
import styles from './MessagesClient.module.scss';

type MessagesClientProps = {
  chats: ChatRoom[] | null;
  currentUserId: string;
};

export const MessagesClient = ({
  chats,
  currentUserId,
}: MessagesClientProps) => {
  const sortedChats =
    useMemo(
      () =>
        chats?.sort((chat) => {
          if (chat.other_user_id === currentUserId) return -1;
          else return 1;
        }),
      [chats, currentUserId],
    ) || [];

  return (
    <div className={styles.messagesClient}>
      <p className={styles.headerTitle}>{MESSAGES_TITLE}</p>

      <div className={styles.chatsWrapper}>
        {sortedChats.map(
          ({
            avatar_url,
            chat_id,
            last_message,
            last_message_time,
            name,
            other_user_id,
          }) => (
            <UserMessageCard
              key={chat_id}
              userId={other_user_id!}
              userName={name!}
              userAvatar={avatar_url!}
              lastMessage={last_message!}
              lastMessageTime={last_message_time!}
              isCurrentUserChat={other_user_id === currentUserId}
            />
          ),
        )}
      </div>
    </div>
  );
};
