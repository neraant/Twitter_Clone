'use server';

import { createClient } from '@/shared/api/supabase/server';

import { INITIAL_MESSAGES_LIMIT } from '../lib';
import { Message } from '../model';

export const getChatMessages = async (
  userId: string,
  limit: number = INITIAL_MESSAGES_LIMIT,
  before?: string,
): Promise<{ messages: Message[]; hasMore: boolean } | null> => {
  const supabase = await createClient();

  const { data: authUser, error: authError } = await supabase.auth.getUser();
  if (!authUser.user || authError) {
    throw new Error('User not authenticated');
  }

  const currentUserId = authUser.user.id;

  let query = supabase
    .from('messages')
    .select('*')
    .or(
      `and(sender_id.eq.${currentUserId},receiver_id.eq.${userId}),and(sender_id.eq.${userId},receiver_id.eq.${currentUserId})`,
    )
    .order('created_at', { ascending: false })
    .limit(limit + 1);

  if (before) {
    query = query.lt('created_at', before);
  }

  const { data: messages, error } = await query;

  if (error) {
    console.error('Error fetching messages:', error);
    return null;
  }

  const hasMore = messages.length > limit;
  const actualMessages = hasMore ? messages.slice(0, -1) : messages;

  return {
    messages: actualMessages.reverse(),
    hasMore,
  };
};

export const getInitialChatMessages = async (
  userId: string,
  limit: number = INITIAL_MESSAGES_LIMIT,
): Promise<{ messages: Message[]; hasMore: boolean } | null> => {
  return getChatMessages(userId, limit);
};
