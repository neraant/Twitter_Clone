'use client';

import { useRef } from 'react';

import { useModalCloseHandler } from '@/shared/lib/hooks';
import { Button } from '@/shared/ui/button/Button';
import { Overlay } from '@/shared/ui/overlay';
import { SignInput } from '@/shared/ui/sign-input';

import {
  ADDITIONAL_INFO_TITLE,
  EDIT_TITLE,
  LABELS,
  SAVE_BUTTON_LABEL,
} from '../lib';
import styles from './EditProfileModal.module.scss';

type EditProfileModalProps = {
  onClose: () => void;
};

export const EditProfileModal = ({ onClose }: EditProfileModalProps) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const { isClosing, handleClose } = useModalCloseHandler(modalRef, onClose);

  return (
    <Overlay isClosing={isClosing} onClickOutside={handleClose}>
      <div
        ref={modalRef}
        className={styles.modalWrapper}
        onClick={(e) => e.stopPropagation()}
      >
        <h2>{EDIT_TITLE}</h2>

        <SignInput label={LABELS.NAME} />

        <h4>{ADDITIONAL_INFO_TITLE}</h4>

        <SignInput label={LABELS.TELEGRAM} />

        <SignInput label={LABELS.BIO} />

        <div className={styles.genderWrapper}>
          <span className={styles.genderLabel}>{LABELS.GENDER}</span>
          {/* <DropDownList placeholder={LABELS.BIO} options={GENDER_OPTIONS} /> */}
        </div>

        <Button ariaLabel='save'>{SAVE_BUTTON_LABEL}</Button>
      </div>
    </Overlay>
  );
};
