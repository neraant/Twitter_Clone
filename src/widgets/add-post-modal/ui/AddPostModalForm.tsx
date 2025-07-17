'use client';

import clsx from 'clsx';
import { useEffect } from 'react';

import { AddTweetButton } from '@/features/add-tweet-button';
import { PostImageUploader } from '@/features/image-uploader/ui';
import { MAX_VERCEL_SIZE } from '@/shared/lib/image';
import { CircleProgressBar } from '@/shared/ui/progress-bar';
import { usePostForm } from '@/widgets/add-post-form/lib';

import { MAX_LENGTH, TEXTAREA_PLACEHOLDER } from '../lib';
import styles from './AddPostModalForm.module.scss';

type AddPostModalFormProps = {
  userId: string;
  onSuccess?: () => void;
  onFormDataChange?: ({
    content,
    previews,
  }: {
    content: string;
    previews: string[];
  }) => void;
};

export const AddPostModalForm = ({
  userId,
  onSuccess,
  onFormDataChange,
}: AddPostModalFormProps) => {
  const {
    handleSubmit,
    onSubmit,
    register,
    watch,
    removeImage,
    handleChange: handleImagesChange,
    previews,
    previewItems,
    imagesSize,
    isSubmitting,
    imageError,
    errors,
    isUploading,
    uploadProgress,
  } = usePostForm({ userId: userId, onSuccess });

  const content = watch('content') || '';
  const contentLength = content.length;
  const isOverLimit = contentLength >= MAX_LENGTH;

  useEffect(() => {
    onFormDataChange?.({ content, previews });
  }, [content, onFormDataChange, previews]);

  if (!userId) return null;

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.content}>
        <div className={styles.textAreaWrapper}>
          <textarea
            {...register('content')}
            placeholder={TEXTAREA_PLACEHOLDER}
            className={styles.textarea}
            maxLength={MAX_LENGTH}
            rows={3}
          />

          <p
            className={clsx(styles.counterText, {
              [styles.errorText]: isOverLimit,
            })}
          >
            {contentLength}/{MAX_LENGTH}
          </p>

          <p className={styles.maxVercelSize}>
            ({imagesSize}MB/{MAX_VERCEL_SIZE}MB per image)
          </p>
        </div>

        <PostImageUploader
          label='modal-post'
          imagePreviews={previews}
          handleChange={handleImagesChange}
          previewItems={previewItems}
          onRemove={removeImage}
          className={styles.actions}
        >
          {isUploading && (
            <CircleProgressBar
              size={30}
              strokeWidth={4}
              progress={uploadProgress}
              className={styles.progressBar}
            />
          )}
          <AddTweetButton isLoading={isSubmitting} />
        </PostImageUploader>

        <p className={styles.error}>{errors.content?.message || imageError}</p>
      </div>
    </form>
  );
};
