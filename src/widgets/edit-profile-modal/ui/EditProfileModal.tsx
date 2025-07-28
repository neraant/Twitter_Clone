'use client';

import clsx from 'clsx';
import { useState } from 'react';

import { ProfileImageUploader } from '@/features/image-uploader';
import { DEFAULT_AVATAR, DEFAULT_BANNER } from '@/shared/lib/common';
import { useImageUpload, useModal } from '@/shared/lib/hooks';
import { GENDER_OPTIONS } from '@/shared/lib/validations';
import { Button } from '@/shared/ui/button/Button';
import { DropDownList } from '@/shared/ui/dropdown-list/DropDownList';
import { CrossIcon } from '@/shared/ui/icon';
import { Loader } from '@/shared/ui/loader';
import { Overlay } from '@/shared/ui/overlay';
import { SignInput } from '@/shared/ui/sign-input';
import { ChangePasswordModal } from '@/widgets/change-password-modal';

import {
  ADDITIONAL_INFO_TITLE,
  CHANGE_PASSWORD_BUTTON,
  EDIT_TITLE,
  LABELS,
  SAVE_BUTTON_LABEL,
  useEditProfileForm,
} from '../lib';
import styles from './EditProfileModal.module.scss';

type EditProfileModalProps = {
  onClose: () => void;
};

export const EditProfileModal = ({ onClose }: EditProfileModalProps) => {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const {
    isClosing,
    handleClose,
    ref: modalRef,
  } = useModal<HTMLFormElement>({ onClose, isActive: !isPasswordModalOpen });

  const {
    user,
    form,
    isLoading,
    avatarPreview,
    bannerPreview,
    isChanged,
    onSubmit,
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

  const handlePasswordModalClose = () => {
    setIsPasswordModalOpen(false);
  };

  if (!user) return null;

  return (
    <>
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

          <h2 className={styles.title}>{EDIT_TITLE}</h2>

          <div className={styles.modalContent}>
            <SignInput
              {...register('name')}
              label={LABELS.NAME}
              error={errors.name}
              className={styles.input}
            />

            <button
              type='button'
              aria-label='change password'
              onClick={() => setIsPasswordModalOpen(true)}
              className={styles.changePasswordButton}
            >
              {CHANGE_PASSWORD_BUTTON}
            </button>

            <div className={styles.uploadersWrapper}>
              <div className={clsx(styles.uploaderWrapper, styles.avatar)}>
                <ProfileImageUploader
                  label='avatar'
                  imagePreview={avatarPreview ?? DEFAULT_AVATAR}
                  handleChange={handleChangeAvatar}
                  className={styles.avatar}
                />
                {avatarError && <p className={styles.error}>{avatarError}</p>}
              </div>
              <div className={clsx(styles.uploaderWrapper, styles.banner)}>
                <ProfileImageUploader
                  label='banner'
                  imagePreview={bannerPreview ?? DEFAULT_BANNER}
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

              <p className={styles.genderLabel}>{LABELS.GENDER}</p>
              <DropDownList
                placeholder={user?.gender || LABELS.BIO}
                options={GENDER_OPTIONS}
                onSelect={handleGender}
                selected={watch('gender')}
              />

              {errors.gender && (
                <p className={styles.error}>{errors.gender.message}</p>
              )}
            </div>
          </div>

          <div className={styles.submitButtonWrapper}>
            <Button
              ariaLabel='save'
              type='submit'
              disabled={isLoading || !isChanged}
              className={styles.submitButton}
            >
              {SAVE_BUTTON_LABEL}
              {isLoading && <Loader className={styles.loader} />}
            </Button>
          </div>
        </form>
      </Overlay>

      {isPasswordModalOpen && (
        <ChangePasswordModal onClose={handlePasswordModalClose} />
      )}
    </>
  );
};
