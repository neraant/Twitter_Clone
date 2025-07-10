import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import { Post } from '@/entities/post';
import { createPostAction } from '@/features/add-tweet-button';
import { uploadImage } from '@/features/image-uploader';
import { useToast } from '@/shared/lib/toast';

import { addTweetSchema } from './addPostForm.schema';
import { usePostImages } from './usePostImages';

export const usePostForm = ({ userId }: { userId?: string }) => {
  const {
    previews,
    error: imageError,
    imageFiles,
    handleChange,
    removeImage,
    resetImages,
  } = usePostImages();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(addTweetSchema),
    defaultValues: {
      content: '',
    },
  });

  const { showToast } = useToast();

  const onSubmit = async (data: { content: string }) => {
    if (!userId) return;

    try {
      const uploadedUrls: string[] = [];

      for (const file of imageFiles) {
        const publicUrl = await uploadImage(file, 'posts', userId);
        uploadedUrls.push(publicUrl);
      }

      const payload: Post = {
        author_id: userId,
        content: data.content,
        image_urls: uploadedUrls,
        created_at: new Date().toISOString(),
      };

      await createPostAction(payload);
      reset();
      resetImages();
      showToast('Success', 'Post created successfully!', 'success');
    } catch (error) {
      console.error(error);
      showToast('Error', 'Post creating failure', 'error');
    }
  };

  return {
    handleSubmit,
    onSubmit,
    register,
    watch,
    previews,
    handleChange,
    removeImage,
    isSubmitting,
    imageError,
    errors,
  };
};
