import DefaultAvatar from '@assets/images/user-avatar.png';
import Image from 'next/image';

import { AddTweetButton } from '@/features/add-tweet-button';
import { useAuthStore } from '@/features/auth';
import { PostImageUploader } from '@/features/image-uploader';

import { TEXTAREA_PLACEHOLDER, usePostForm } from '../lib';
import styles from './AddPostForm.module.scss';

export const AddPostForm = () => {
  const user = useAuthStore((state) => state.user);

  const {
    handleSubmit,
    onSubmit,
    register,
    previews,
    handleChange,
    removeImage,
    isSubmitting,
    imageError,
    errors,
  } = usePostForm({ userId: user?.id });

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
        <textarea
          {...register('content')}
          placeholder={TEXTAREA_PLACEHOLDER}
          className={styles.textarea}
          rows={3}
        />

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
