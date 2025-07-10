import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import { CreatePostPayload } from '@/entities/post';
import { createPostAction } from '@/features/add-tweet-button';
import { uploadPost } from '@/features/image-uploader';
import { useToast } from '@/shared/lib/toast';

import { addTweetSchema } from './addPostForm.schema';
import { usePostImages } from './usePostImages';

type usePostFormProps = {
  userId: string;
  onPostCreated?: () => void;
};

export const usePostForm = ({ userId, onPostCreated }: usePostFormProps) => {
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
    setValue,
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
        const publicUrl = await uploadPost(file, 'posts', userId);
        uploadedUrls.push(publicUrl);
      }

      const payload: CreatePostPayload = {
        author_id: userId,
        content: data.content,
        image_urls: uploadedUrls,
      };

      await createPostAction(payload);

      reset();
      resetImages();
      showToast('Success', 'Post created successfully!', 'success');

      onPostCreated?.();
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
    setValue,
    handleChange,
    removeImage,
    previews,
    isSubmitting,
    imageError,
    errors,
  };
};
