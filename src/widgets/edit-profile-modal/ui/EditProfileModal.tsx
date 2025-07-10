'use client';

import clsx from 'clsx';
import { useRef } from 'react';

import { ProfileImageUploader } from '@/features/image-uploader';
import { useImageUpload, useModalCloseHandler } from '@/shared/lib/hooks';
import { Button } from '@/shared/ui/button/Button';
import { DropDownList } from '@/shared/ui/dropdown-list/DropDownList';
import { CrossIcon } from '@/shared/ui/icon';
import { Loader } from '@/shared/ui/loader';
import { Overlay } from '@/shared/ui/overlay';
import { SignInput } from '@/shared/ui/sign-input';

import {
  ADDITIONAL_INFO_TITLE,
  EDIT_TITLE,
  GENDER_OPTIONS,
  LABELS,
  SAVE_BUTTON_LABEL,
  useEditProfileForm,
} from '../lib';
import styles from './EditProfileModal.module.scss';

type EditProfileModalProps = {
  onClose: () => void;
};

export const EditProfileModal = ({ onClose }: EditProfileModalProps) => {
  const modalRef = useRef<HTMLFormElement | null>(null);
  const { isClosing, handleClose } = useModalCloseHandler(modalRef, onClose);

  const {
    form,
    onSubmit,
    isLoading,
    user,
    avatarPreview,
    bannerPreview,
    handleAvatarChange,
    handleBannerChange,
  } = useEditProfileForm(handleClose);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const { handleChange: handleChangeAvatar, error: avatarError } =
    useImageUpload({
      onFileChange: (files) => {
        const filesArray = Array.isArray(files) ? files : [files];
        handleAvatarChange(filesArray[0]);
      },
    });

  const { handleChange: handleChangeBanner, error: bannerError } =
    useImageUpload({
      onFileChange: (files) => {
        const filesArray = Array.isArray(files) ? files : [files];
        handleBannerChange(filesArray[0]);
      },
    });

  const handleGender = (value: string) => {
    setValue('gender', value);
  };

  if (!user) return null;

  return (
    <Overlay isClosing={isClosing} onClickOutside={handleClose}>
      <form
        ref={modalRef}
        className={clsx(styles.modalWrapper, isClosing && styles.closing)}
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit(onSubmit)}
      >
        <button type='button' aria-label='close' onClick={handleClose}>
          <CrossIcon width={18} height={18} className={styles.closeButton} />
        </button>

        <div className={styles.modalContent}>
          <h2 className={styles.title}>{EDIT_TITLE}</h2>

          <SignInput
            {...register('name')}
            label={LABELS.NAME}
            error={errors.name}
            className={styles.input}
          />

          <div className={styles.uploadersWrapper}>
            <div className={clsx(styles.uploaderWrapper, styles.avatar)}>
              <ProfileImageUploader
                label='avatar'
                imagePreview={avatarPreview ?? '/images/user-avatar.png'}
                handleChange={handleChangeAvatar}
                className={styles.avatar}
              />
              {avatarError && <p className={styles.error}>{avatarError}</p>}
            </div>
            <div className={clsx(styles.uploaderWrapper, styles.banner)}>
              <ProfileImageUploader
                label='banner'
                imagePreview={bannerPreview ?? '/images/default-banner.png'}
                handleChange={handleChangeBanner}
                className={styles.banner}
              />
              {bannerError && <p className={styles.error}>{bannerError}</p>}
            </div>
          </div>

          <h4 className={styles.subtitle}>{ADDITIONAL_INFO_TITLE}</h4>

          <SignInput
            {...register('telegram')}
            label={LABELS.TELEGRAM}
            error={errors.telegram}
            className={styles.input}
          />

          <SignInput
            {...register('bio')}
            label={LABELS.BIO}
            error={errors.bio}
            className={styles.input}
          />

          <div className={styles.genderWrapper}>
            <input type='hidden' {...register('gender')} />

            <span className={styles.genderLabel}>{LABELS.GENDER}</span>
            <DropDownList
              placeholder={user?.gender || LABELS.BIO}
              options={GENDER_OPTIONS}
              onSelect={handleGender}
              selected={watch('gender')}
            />

            {errors.gender && (
              <span className={styles.error}>{errors.gender.message}</span>
            )}
          </div>
        </div>

        <div className={styles.submitButtonWrapper}>
          <Button
            ariaLabel='save'
            type='submit'
            disabled={isLoading}
            className={styles.submitButton}
          >
            {SAVE_BUTTON_LABEL}
            {isLoading && <Loader className={styles.loader} />}
          </Button>
        </div>
      </form>
    </Overlay>
  );
};
