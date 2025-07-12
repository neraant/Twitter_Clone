import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';

import { hasEmailProvider } from '@/entities/user/lib';
import { ChangePasswordButton } from '@/features/change-password';
import {
  changePasswordWithEmailAction,
  changePasswordWithGoogleAction,
} from '@/features/change-password/api';
import { useModalCloseHandler } from '@/shared/lib/hooks';
import { useToast } from '@/shared/lib/toast';
import { CrossIcon } from '@/shared/ui/icon';
import { Loader } from '@/shared/ui/loader';
import { Overlay } from '@/shared/ui/overlay';
import { SignInput } from '@/shared/ui/sign-input';

import { CHANGE_TITLE, changePasswordFormData } from '../lib';
import { usePasswordForm } from '../lib/usePasswordForm';
import styles from './ChangePasswordModal.module.scss';

type ChangePasswordModalProps = {
  onClose: () => void;
};

export const ChangePasswordModal = ({ onClose }: ChangePasswordModalProps) => {
  const modalRef = useRef<HTMLFormElement | null>(null);
  const [isEmailUser, setIsEmailUser] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { isClosing, handleClose, handleClickOutside } = useModalCloseHandler(
    modalRef,
    onClose,
  );

  const { handleSubmit, register, errors } = usePasswordForm(isEmailUser);

  const { showToast } = useToast();

  useEffect(() => {
    const checkUserType = async () => {
      const isEmail = await hasEmailProvider();
      setIsEmailUser(isEmail);
    };
    checkUserType();
  }, []);

  const onSubmit = async (formData: changePasswordFormData) => {
    const { currentPassword, changePassword } = formData;

    try {
      setIsLoading(true);
      if (isEmailUser) {
        if (!currentPassword) {
          showToast('Error', 'Current password is required', 'error');
          return;
        }

        const { success, message } = await changePasswordWithEmailAction(
          currentPassword,
          changePassword,
        );

        if (success) {
          showToast('Success', message, 'success');
          handleClose();
        } else {
          showToast('Error', message, 'error');
        }
      } else {
        const { success, message } =
          await changePasswordWithGoogleAction(changePassword);

        if (success) {
          showToast('Success', message, 'success');
          handleClose();
        } else {
          showToast('Error', message, 'error');
        }
      }
    } catch (error) {
      console.error(error);
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred';
      showToast('Error', errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Overlay isClosing={isClosing} onClickOutside={handleClickOutside}>
      <form
        ref={modalRef}
        className={clsx(
          styles.passwordModalWrapper,
          isClosing && styles.closing,
        )}
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit(onSubmit)}
      >
        <button type='button' aria-label='close' onClick={handleClose}>
          <CrossIcon
            width={18}
            height={18}
            className={styles.passwordCloseButton}
          />
        </button>

        <div className={styles.passwordModalContent}>
          <h2 className={styles.passwordTitle}>{CHANGE_TITLE}</h2>

          {isEmailUser === null ? (
            <Loader size='40' className={styles.loader} />
          ) : (
            <div className={styles.inputsWrapper}>
              {isEmailUser && (
                <SignInput
                  {...register('currentPassword')}
                  label='Current password'
                  error={errors.currentPassword}
                  className={styles.input}
                  name='currentPassword'
                  autoComplete='current-password'
                  isPassword
                />
              )}

              <SignInput
                {...register('changePassword')}
                label='Change password'
                error={errors.changePassword}
                isPassword
                className={styles.input}
                name='changePassword'
                autoComplete='new-password'
              />

              <SignInput
                {...register('confirmPassword')}
                label='Confirm password'
                error={errors.confirmPassword}
                isPassword
                className={styles.input}
                name='confirmPassword'
                autoComplete='new-password'
              />
            </div>
          )}
        </div>

        <ChangePasswordButton
          className={styles.changeButton}
          isLoading={isLoading}
        />
      </form>
    </Overlay>
  );
};
