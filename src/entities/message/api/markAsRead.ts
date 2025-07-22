'use server';

import { createClient } from '@/shared/api/supabase/server';

export const markAsRead = async (messageIds: string[]): Promise<void> => {
  console.log('Calling markAsRead for messages:', messageIds);
  if (!messageIds.length) return;

  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('messages')
      .update({ read: true })
      .in('id', messageIds);

    if (error) {
      console.error('Failed to mark messages as read!', error);
      throw new Error('Failed to mark messages as read!');
    }
  } catch (error) {
    console.error('Failed to mark messages as read!', error);
    throw new Error('Failed to mark messages as read!');
  }
};
