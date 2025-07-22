import { Metadata } from 'next';

import { getChatMessages, INITIAL_MESSAGES_LIMIT } from '@/entities/message';
import { getCurrentUserAction, getUserByIdAction } from '@/entities/user/api';
import { MessagesList } from '@/widgets/messages-list';

export const metadata: Metadata = {
  title: 'Twitter Clone | Chat',
  description: 'Chat privately with friends 💬',
};

export default async function Messages({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  try {
    const [messagesResult, selectedUser, currentUser] = await Promise.all([
      getChatMessages(userId, INITIAL_MESSAGES_LIMIT),
      getUserByIdAction(userId),
      getCurrentUserAction(),
    ]);

    if (!selectedUser || !currentUser) {
      throw new Error('Users need to be provided');
    }

    if (!messagesResult) {
      throw new Error('Failed to load messages');
    }

    return (
      <MessagesList
        initialMessages={messagesResult.messages}
        initialHasMore={messagesResult.hasMore}
        selectedUser={selectedUser}
        currentUser={currentUser}
      />
    );
  } catch (error) {
    console.error(error);
    throw new Error('Failed to load messages');
  }
}
