'use server';

import { revalidateTag } from 'next/cache';

import { CreatePostPayload } from '@/entities/post';
import { createClient } from '@/shared/api/supabase/server';

export const createPostAction = async (payload: CreatePostPayload) => {
  try {
    const supabase = await createClient();

    const { error } = await supabase.from('posts').insert(payload);

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(error.message);
    }

    revalidateTag('user-profile');

    return { success: true };
  } catch (error) {
    console.error('createPostAction error:', error);
    throw error;
  }
};
