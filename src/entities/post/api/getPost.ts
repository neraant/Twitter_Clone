'use server';

import { notFound } from 'next/navigation';

import { createClient } from '@/shared/api/supabase/server';

import { Post } from '../model';

export const getPost = async (postId: string): Promise<Post> => {
  const supabase = await createClient();

  const { data: post, error: postError } = await supabase
    .from('post_with_author_and_likes')
    .select('*')
    .eq('id', postId)
    .eq('is_deleted', false)
    .maybeSingle();

  if (postError || !post) {
    notFound();
  }

  return post;
};
