import clsx from 'clsx';
import Image from 'next/image';

import { AddTweetButton } from '@/features/add-tweet-button';
import { useAuthStore } from '@/features/auth';
import { PostImageUploader } from '@/features/image-uploader';

import { MAX_LENGTH, TEXTAREA_PLACEHOLDER, usePostForm } from '../lib';
import styles from './AddPostForm.module.scss';

const DefaultAvatar = '/images/user-avatar.png';

export const AddPostForm = () => {
  const user = useAuthStore((state) => state.user);

  const {
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
  } = usePostForm({ userId: user?.id });

  const content = watch('content') || '';
  const contentLength = content.length;
  const isOverLimit = contentLength > MAX_LENGTH;

  if (!user) return null;

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <Image
        src={user.avatar_url ?? DefaultAvatar}
        alt='avatar'
        width={50}
        height={50}
        className={styles.avatarIcon}
      />

      <div className={styles.content}>
        <div className={styles.textAreaWrapper}>
          <textarea
            {...register('content')}
            placeholder={TEXTAREA_PLACEHOLDER}
            className={styles.textarea}
            rows={3}
          />

          <p
            className={clsx(styles.counterText, {
              [styles.error]: isOverLimit,
            })}
          >
            {contentLength}/{MAX_LENGTH}
          </p>
        </div>

        <PostImageUploader
          label='post'
          imagePreviews={previews}
          handleChange={handleChange}
          onRemove={removeImage}
          className={styles.actions}
        >
          <AddTweetButton isLoading={isSubmitting} />
        </PostImageUploader>

        <span className={styles.error}>
          {errors.content?.message || imageError}
        </span>
      </div>
    </form>
  );
};
