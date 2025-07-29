'use server';

import { Post } from '@/entities/post';
import { createClient } from '@/shared/api/supabase/server';
import { StorageFolders } from '@/shared/lib/database';
import { IMAGE_TYPES, MAX_IMAGE_SIZE_5MB } from '@/shared/lib/image';

import {
  AVATAR_DEFAULT_QUALITY,
  AVATAR_DEFAULT_SIZE,
  checkDuplicateImage,
  POST_DEFAULT_QUALITY,
  POST_DEFAULT_SIZE,
  processImage,
} from '../lib';
import {
  createImageHash,
  createPerceptualHash,
} from '../lib/createImageHash.utils';

export interface UploadResult {
  url: string;
  isDuplicate: boolean;
  duplicatePost?: Post;
  imageHash?: string;
  perceptualHash?: string;
}

export async function uploadSingleImage(
  file: File,
  folder: StorageFolders,
  userId: string,
  shouldReplace: boolean = false,
  checkDuplicates: boolean = true,
): Promise<UploadResult> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const supabase = await createClient();

  if (!file.type.startsWith('image/')) {
    throw new Error('Invalid file type. Please upload an image.');
  }

  if (file.size > MAX_IMAGE_SIZE_5MB) {
    throw new Error('Maximum size is 5MB');
  }

  const fileExt = file.name.split('.').pop()?.toLowerCase();
  if (!fileExt || !IMAGE_TYPES.includes(fileExt)) {
    throw new Error('Unsupported file extension (jpg, jpeg, png, gif, webp)');
  }

  let imageHash: string | undefined;
  let perceptualHash: string | undefined;

  if (checkDuplicates && folder === StorageFolders.posts) {
    const duplicateResult = await checkDuplicateImage(userId, buffer);

    if (duplicateResult.isDuplicate) {
      return {
        url: duplicateResult.imageUrl!,
        isDuplicate: true,
        duplicatePost: duplicateResult.post as Post,
      };
    }

    imageHash = await createImageHash(buffer);
    perceptualHash = await createPerceptualHash(buffer);
  }

  const processOptions = getProcessingOptions(folder);
  const processedImage = await processImage(buffer, processOptions);

  const timestamp = Date.now();
  const filePath = `${userId}/${timestamp}.webp`;

  if (shouldReplace) {
    const { data: existingFiles } = await supabase.storage
      .from(folder)
      .list(userId);

    if (existingFiles && existingFiles.length > 0) {
      const filesToDelete = existingFiles.map(
        (file) => `${userId}/${file.name}`,
      );
      await supabase.storage.from(folder).remove(filesToDelete);
    }
  }

  const { error: uploadError } = await supabase.storage
    .from(folder)
    .upload(filePath, processedImage, {
      upsert: true,
      contentType: 'image/webp',
    });

  if (uploadError) {
    throw new Error(`Upload failed: ${uploadError.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from(folder)
    .getPublicUrl(filePath);

  if (!publicUrlData?.publicUrl) {
    throw new Error('Failed to get public URL for uploaded file');
  }

  return {
    url: publicUrlData.publicUrl,
    isDuplicate: false,
    imageHash,
    perceptualHash,
  };
}

const getProcessingOptions = (
  folder: StorageFolders,
): {
  width?: number;
  height?: number;
  quality?: number;
} => {
  switch (folder) {
    case StorageFolders.avatars:
      return {
        width: AVATAR_DEFAULT_SIZE,
        height: AVATAR_DEFAULT_SIZE,
        quality: AVATAR_DEFAULT_QUALITY,
      };
    case StorageFolders.posts:
      return {
        width: POST_DEFAULT_SIZE,
        quality: POST_DEFAULT_QUALITY,
      };
    default:
      return {
        width: POST_DEFAULT_SIZE,
        quality: POST_DEFAULT_QUALITY,
      };
  }
};
