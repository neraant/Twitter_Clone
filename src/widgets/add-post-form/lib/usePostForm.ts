import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import { CreatePostPayload } from '@/entities/post';
import { useCreatePost } from '@/features/add-tweet-button/lib';
import { uploadMultipleImagesAction } from '@/features/image-uploader/lib';
import { StorageFolders } from '@/shared/lib/database';
import { useToast } from '@/shared/lib/toast';

import { addTweetSchema } from './addPostForm.schema';
import { usePostImages } from './usePostImages';

type usePostFormProps = {
  userId: string;
};

export const usePostForm = ({ userId }: usePostFormProps) => {
  const {
    previews,
    error: imageError,
    imageFiles,
    uploadProgress,
    imagesSize,
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

  const createPost = useCreatePost();
  const { showToast } = useToast();

  const onSubmit = async (data: { content: string }) => {
    if (!userId) return;

    try {
      let uploadedUrls: string[] = [];
      let imageHashes: string[] = [];
      let perceptualHashes: string[] = [];

      if (imageFiles.length > 0) {
        const formData = new FormData();
        imageFiles.forEach((file) => {
          formData.append('files', file);
        });

        const uploadResult = await uploadMultipleImagesAction(
          formData,
          StorageFolders.posts,
          userId,
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
      }

      const payload: CreatePostPayload = {
        author_id: userId,
        content: data.content,
        image_urls: uploadedUrls,
        image_hashes: imageHashes,
        perceptual_hashes: perceptualHashes,
      };

      await createPost(payload);

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
    setValue,
    handleChange,
    removeImage,
    imagesSize,
    previews,
    isSubmitting,
    imageError,
    uploadProgress,
    errors,
  };
};
