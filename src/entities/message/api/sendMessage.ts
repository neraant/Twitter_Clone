'use server';

import { createClient } from '@/shared/api/supabase/server';

import { Message } from '../model';

export const sendMessage = async (newMessage: Message): Promise<void> => {
  try {
    const supabase = await createClient();

    const { error } = await supabase.from('messages').insert(newMessage);

    if (error) {
      console.error('Failed to send message!', error);
      throw new Error('Failed to send message!');
    }
  } catch (error) {
    console.error('Failed to send message!', error);
    throw new Error('Failed to send message!');
  }
};
