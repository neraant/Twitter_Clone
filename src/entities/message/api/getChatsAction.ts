'use server';

import { createClient } from '@/shared/api/supabase/server';

import { ChatRoom } from '../model';

export const getChatsAction = async (): Promise<ChatRoom[] | null> => {
  const supabase = await createClient();

  const { data: authUser, error: authError } = await supabase.auth.getUser();

  if (!authUser.user || authError) {
    throw new Error('User not authenticated');
  }

  const { data: chatData, error: chatError } = await supabase
    .from('user_chat_overview')
    .select('*');

  if (chatError) {
    console.error('Error fetching chat data:', chatError);
    return null;
  }

  return chatData;
};
