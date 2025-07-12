'use server';

import { Post } from '@/entities/post';
import { StorageFolders } from '@/shared/lib/database';

import { UploadResult, uploadSingleImage } from '../api/uploadSingleImage';

export interface MultipleUploadResult {
  success: boolean;
  results?: UploadResult[];
  duplicates?: Array<{
    fileName: string;
    duplicatePost: Post;
  }>;
  error?: string;
}

export async function uploadMultipleImagesAction(
  formData: FormData,
  folder: StorageFolders,
  userId: string,
): Promise<MultipleUploadResult> {
  try {
    const files = formData.getAll('files') as File[];
    const uploadResults: UploadResult[] = [];
    const duplicates: Array<{ fileName: string; duplicatePost: Post }> = [];

    for (const file of files) {
      const result = await uploadSingleImage(file, folder, userId, false, true);

      uploadResults.push(result);

      if (result.isDuplicate) {
        duplicates.push({
          fileName: file.name,
          duplicatePost: result.duplicatePost!,
        });
      }
    }

    if (duplicates.length === files.length) {
      return {
        success: true,
        results: uploadResults,
        duplicates,
      };
    }

    return {
      success: true,
      results: uploadResults,
      duplicates: duplicates.length > 0 ? duplicates : undefined,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}
