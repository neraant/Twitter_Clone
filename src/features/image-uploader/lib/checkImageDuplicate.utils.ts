'use server';

import { Post } from '@/entities/post';
import { createClient } from '@/shared/api/supabase/server';

import { createImageHash, createPerceptualHash } from './createImageHash.utils';
import { SIMILIAR_COEF } from './imageUploader.constants';

export interface DuplicateResult {
  isDuplicate: boolean;
  imageUrl?: string;
  post?: Post;
}

export const checkDuplicateImage = async (
  userId: string,
  imageBuffer: Buffer,
): Promise<DuplicateResult> => {
  try {
    const [supabase, imageHash, perceptualHash] = await Promise.all([
      createClient(),
      createImageHash(imageBuffer),
      createPerceptualHash(imageBuffer),
    ]);

    const { data: userPosts } = await supabase
      .from('posts')
      .select('*')
      .eq('author_id', userId)
      .not('image_hashes', 'is', null);

    if (!userPosts || userPosts.length === 0) {
      return { isDuplicate: false };
    }

    for (const post of userPosts) {
      if (post.image_hashes && post.image_urls) {
        const hashIndex = post.image_hashes.indexOf(imageHash);
        if (hashIndex !== -1) {
          return {
            isDuplicate: true,
            imageUrl: post.image_urls[hashIndex],
            post: post,
          };
        }
      }
    }

    for (const post of userPosts) {
      if (post.perceptual_hashes && post.image_urls) {
        for (let i = 0; i < post.perceptual_hashes.length; i++) {
          const existingHash = post.perceptual_hashes[i];
          const similarity = calculateHashSimilarity(
            perceptualHash,
            existingHash,
          );
          if (similarity > SIMILIAR_COEF) {
            return {
              isDuplicate: true,
              imageUrl: post.image_urls[i],
              post: post,
            };
          }
        }
      }
    }

    return { isDuplicate: false };
  } catch (error) {
    console.error('Duplicate checking error:', error);
    throw error;
  }
};

function calculateHashSimilarity(hash1: string, hash2: string): number {
  if (hash1.length !== hash2.length) return 0;

  let matches = 0;
  for (let i = 0; i < hash1.length; i++) {
    if (hash1[i] === hash2[i]) matches++;
  }

  return matches / hash1.length;
}
