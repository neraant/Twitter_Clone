'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import { CreatePostPayload } from '@/entities/post';
import { usePosts } from '@/entities/post/lib';
import { uploadMultipleImagesAction } from '@/features/image-uploader/lib';
import { StorageFolders } from '@/shared/lib/database';
import { useToast } from '@/shared/lib/toast';

import { UPLOADER_DEBOUNCE_TIME } from './addPostForm.constants';
import { addTweetSchema } from './addPostForm.schema';
import { usePostImages } from './usePostImages';

type usePostFormProps = {
  userId: string;
  onSuccess?: () => void;
};

export const usePostForm = ({ userId, onSuccess }: usePostFormProps) => {
  const {
    previews,
    error: imageError,
    imageFiles,
    uploadProgress,
    isUploading,
    imagesSize,
    handleChange,
    removeImage,
    resetImages,
    updateUploadProgress,
    setUploadingStatus,
  } = usePostImages();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(addTweetSchema),
    defaultValues: {
      content: '',
    },
  });

  const { showToast } = useToast();
  const { addPost } = usePosts(userId);

  const onSubmit = async (data: { content: string }) => {
    if (!userId) return;

    try {
      let uploadedUrls: string[] = [];
      let imageHashes: string[] = [];
      let perceptualHashes: string[] = [];

      if (imageFiles.length > 0) {
        setUploadingStatus(true);
        updateUploadProgress(0);

        const formData = new FormData();
        imageFiles.forEach((file) => {
          formData.append('files', file);
        });

        const onProgress = (progress: number) => {
          updateUploadProgress(progress);
        };

        const uploadResult = await uploadMultipleImagesAction(
          formData,
          StorageFolders.posts,
          userId,
          onProgress,
        );
        if (!uploadResult.success) {
          throw new Error(uploadResult.error);
        }

        uploadedUrls = uploadResult.results?.map((result) => result.url) || [];

        if (uploadResult.results && uploadResult.results.length > 0) {
          imageHashes = uploadResult.results
            .filter((result) => !result.isDuplicate && result.imageHash)
            .map((result) => result.imageHash!);

          perceptualHashes = uploadResult.results
            .filter((result) => !result.isDuplicate && result.perceptualHash)
            .map((result) => result.perceptualHash!);
        }

        updateUploadProgress(100);
        await new Promise((res) => setTimeout(res, UPLOADER_DEBOUNCE_TIME));
        setUploadingStatus(false);
      }

      const payload: CreatePostPayload = {
        author_id: userId,
        content: data.content,
        image_urls: uploadedUrls,
        image_hashes: imageHashes,
        perceptual_hashes: perceptualHashes,
      };

      await addPost.mutateAsync(payload);

      reset();
      resetImages();
      showToast('Success', 'Post created successfully!', 'success');
      onSuccess?.();
    } catch (error) {
      console.error(error);
      showToast(
        'Error',
        error instanceof Error ? error.message : 'Post creating failure',
        'error',
      );
    }
  };

  return {
    handleSubmit,
    onSubmit,
    register,
    watch,
    setValue,
    handleChange,
    removeImage,
    imagesSize,
    previews,
    isSubmitting: isSubmitting || isUploading,
    imageError,
    uploadProgress,
    isUploading,
    errors,
  };
};
