'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import clsx from 'clsx';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { User } from '@/entities/user';
import { useAuthStore } from '@/features/auth';
import { useModalCloseHandler } from '@/shared/lib/hooks';
import { useToast } from '@/shared/lib/toast';
import { Button } from '@/shared/ui/button/Button';
import { DropDownList } from '@/shared/ui/dropdown-list/DropDownList';
import { CrossIcon } from '@/shared/ui/icon';
import { Loader } from '@/shared/ui/loader';
import { Overlay } from '@/shared/ui/overlay';
import { SignInput } from '@/shared/ui/sign-input';

import { editProfileAction } from '../api';
import {
  ADDITIONAL_INFO_TITLE,
  EDIT_TITLE,
  EditFormData,
  editModalSchema,
  GENDER_OPTIONS,
  LABELS,
  SAVE_BUTTON_LABEL,
} from '../lib';
import styles from './EditProfileModal.module.scss';

type EditProfileModalProps = {
  onClose: () => void;
};

export const EditProfileModal = ({ onClose }: EditProfileModalProps) => {
  const modalRef = useRef<HTMLFormElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { isClosing, handleClose } = useModalCloseHandler(modalRef, onClose);

  const user = useAuthStore((state) => state.user);
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(editModalSchema),
    defaultValues: {
      name: user?.name ?? '',
      telegram: user?.user_telegram ?? '',
      bio: user?.bio ?? '',
      gender: user?.gender ?? '',
    },
  });

  const onSubmit = async (data: EditFormData) => {
    try {
      if (!user?.id) {
        console.error('No user id available!');
        return;
      }

      setIsLoading(true);

      const updatedProfile = await editProfileAction(user.id, data);

      if (!updatedProfile) {
        throw new Error('Failed to update profile');
      }

      const updatedUser: User = {
        ...user,
        name: updatedProfile.name ?? user.name,
        avatar_url: updatedProfile.avatar_url ?? user.avatar_url,
        banner_url: updatedProfile.banner_url ?? user.banner_url,
        phone_number: updatedProfile.phone_number ?? user.phone_number,
        date_of_birth: updatedProfile.date_of_birth ?? user.date_of_birth,
        updated_at: updatedProfile.updated_at ?? user.updated_at,
        followers_count: updatedProfile.followers_count ?? user.followers_count,
        following_count: updatedProfile.following_count ?? user.following_count,
        user_telegram: updatedProfile.user_telegram ?? user.user_telegram,
        bio: updatedProfile.bio ?? user.bio,
        gender: updatedProfile.gender ?? user.gender,
      };

      useAuthStore.getState().updateCurrentUser(updatedUser);

      showToast('Success', 'Profile updated!', 'success');
      handleClose();
    } catch (error) {
      console.error(error);
      showToast('Error', 'Edit failure!', 'error');
    } finally {
      setIsLoading(false);
    }
  };

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
