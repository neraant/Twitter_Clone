import { ChatRoom } from '@/entities/message';
import { UserMessageCard } from '@/entities/user';

import { MESSAGES_TITLE } from '../lib';
import styles from './MessagesClient.module.scss';

type MessagesClientProps = {
  chats: ChatRoom[] | null;
};

export const MessagesClient = ({ chats }: MessagesClientProps) => {
  return (
    <div className={styles.messagesClient}>
      <p className={styles.headerTitle}>{MESSAGES_TITLE}</p>

      <div className={styles.chatsWrapper}>
        {chats?.map(
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
            />
          ),
        )}
      </div>
    </div>
  );
};
