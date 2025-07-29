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
  onProgress?: (progress: number) => void,
): Promise<MultipleUploadResult> {
  try {
    const files = formData.getAll('files') as File[];
    const uploadResults: UploadResult[] = [];
    const duplicates: Array<{ fileName: string; duplicatePost: Post }> = [];

    const totalFiles = files.length;

    for (let i = 0; i < totalFiles; i++) {
      const file = files[i];

      if (onProgress) {
        const progress = (i / totalFiles) * 100;
        onProgress(progress);
      }

      const result = await uploadSingleImage(file, folder, userId, false, true);

      uploadResults.push(result);

      if (result.isDuplicate) {
        duplicates.push({
          fileName: file.name,
          duplicatePost: result.duplicatePost!,
        });
      }

      if (onProgress) {
        const progress = ((i + 1) / totalFiles) * 100;
        onProgress(progress);
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
