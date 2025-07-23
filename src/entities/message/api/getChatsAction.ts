'use server';

import { createClient } from '@/shared/api/supabase/server';

import { ChatRoom } from '../model';

export const getChatsAction = async (): Promise<{
  chats: ChatRoom[];
  userId: string;
}> => {
  const supabase = await createClient();

  const { data: authUser, error: authError } = await supabase.auth.getUser();

  if (!authUser.user || authError) {
    throw new Error('User not authenticated');
  }

  const currentUserId = authUser.user.id;

  const { data: chatData, error: chatError } = await supabase
    .from('user_chat_overview')
    .select('*');

  if (chatError) {
    console.error('Error fetching chat data:', chatError);
    return { chats: [], userId: currentUserId };
  }

  const selfChatExists = chatData?.some(
    (chat) => chat.other_user_id === currentUserId,
  );

  if (!selfChatExists) {
    chatData?.unshift({
      chat_id: `self-${currentUserId}`,
      other_user_id: currentUserId,
      avatar_url: authUser.user.user_metadata?.avatar_url || '',
      name: authUser.user.user_metadata?.name || 'You',
      last_message: 'Its your private chat ✨',
      last_message_time: new Date().toISOString(),
    });
  }

  return { chats: chatData ?? [], userId: currentUserId };
};
