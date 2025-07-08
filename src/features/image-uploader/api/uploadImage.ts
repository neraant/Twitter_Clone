import { createClient } from '@/shared/api/supabase/client';
import { IMAGE_TYPES, MAX_IMAGE_SIZE } from '@/shared/lib/image';

export const uploadImage = async (
  file: File,
  folder: 'avatars' | 'banners',
  userId: string,
): Promise<string> => {
  const supabase = createClient();

  if (!file.type.startsWith('image/')) {
    throw new Error('Invalid file type. Please upload an image.');
  }

  const maxSize = MAX_IMAGE_SIZE;
  if (file.size > maxSize) {
    throw new Error('File size too large. Maximum size is 5MB.');
  }

  const fileExt = file.name.split('.').pop()?.toLowerCase();
  if (!fileExt || !IMAGE_TYPES.includes(fileExt)) {
    throw new Error('Unsupported file extension. Use JPG, PNG, GIF, or WebP.');
  }

  const timestamp = Date.now();
  const filePath = `${userId}/${timestamp}.${fileExt}`;

  try {
    const { data: existingFiles } = await supabase.storage
      .from(folder)
      .list(userId);

    if (existingFiles && existingFiles.length > 0) {
      const filesToDelete = existingFiles.map(
        (file) => `${userId}/${file.name}`,
      );
      await supabase.storage.from(folder).remove(filesToDelete);
    }

    const { error: uploadError } = await supabase.storage
      .from(folder)
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type,
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

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error(`Upload error in ${folder}:`, error);
    throw error;
  }
};
