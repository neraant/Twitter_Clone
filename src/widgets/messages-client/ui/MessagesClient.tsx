'use client';

import { useMemo } from 'react';

import { ChatRoom } from '@/entities/message';
import { UserMessageCard } from '@/entities/user';

import { MESSAGES_TITLE } from '../lib';
import { useRealtimeChats } from '../lib/useRealtimeChats';
import styles from './MessagesClient.module.scss';

type MessagesClientProps = {
  chats: ChatRoom[] | null;
  currentUserId: string;
};

export const MessagesClient = ({
  chats: initialChats,
  currentUserId,
}: MessagesClientProps) => {
  const { chats, isConnected } = useRealtimeChats({
    initialChats,
    currentUserId,
  });

  const sortedChats =
    useMemo(
      () =>
        chats?.sort((a, b) => {
          const timeA = new Date(a.last_message_time || 0).getTime();
          const timeB = new Date(b.last_message_time || 0).getTime();
          if (timeB !== timeA) return timeB - timeA;

          if (a.other_user_id === currentUserId) return -1;
          if (b.other_user_id === currentUserId) return 1;

          return 0;
        }),
      [chats, currentUserId],
    ) || [];

  return (
    <div className={styles.messagesClient}>
      <div className={styles.header}>
        <p className={styles.headerTitle}>{MESSAGES_TITLE}</p>

        {!isConnected && (
          <div className={styles.connectionStatus}>
            <span>Connecting...</span>
          </div>
        )}
      </div>

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
