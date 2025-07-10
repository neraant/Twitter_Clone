import clsx from 'clsx';
import Image from 'next/image';

import { User } from '@/entities/user';
import { AddTweetButton } from '@/features/add-tweet-button';
import { PostImageUploader } from '@/features/image-uploader';

import { MAX_LENGTH, TEXTAREA_PLACEHOLDER, usePostForm } from '../lib';
import styles from './AddPostForm.module.scss';

const DefaultAvatar = '/images/user-avatar.png';

type AddPostFormProps = {
  user: User;
  onPostCreated: () => void;
};

export const AddPostForm = ({ user, onPostCreated }: AddPostFormProps) => {
  const {
    handleSubmit,
    onSubmit,
    register,
    watch,
    handleChange: handleImagesChange,
    previews,
    removeImage,
    isSubmitting,
    imageError,
    errors,
  } = usePostForm({ userId: user?.id, onPostCreated });

  const content = watch('content') || '';
  const contentLength = content.length;
  const isOverLimit = contentLength >= MAX_LENGTH;

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
        </div>

        <PostImageUploader
          label='post'
          imagePreviews={previews}
          handleChange={handleImagesChange}
          onRemove={removeImage}
          className={styles.actions}
        >
          <AddTweetButton isLoading={isSubmitting} />
        </PostImageUploader>

        <p className={styles.error}>{errors.content?.message || imageError}</p>
      </div>
    </form>
  );
};
