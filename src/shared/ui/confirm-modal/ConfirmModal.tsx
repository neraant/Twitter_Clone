'use client';

import clsx from 'clsx';
import { useRef } from 'react';

import { CANCEL_TEXT } from '@/shared/lib/confirm-modal';
import { useModalCloseHandler } from '@/shared/lib/hooks';

import { CrossIcon } from '../icon';
import { Loader } from '../loader';
import { Overlay } from '../overlay';
import styles from './ConfirmModal.module.scss';

type ConfirmModalProps = {
  title: string;
  description: string;
  actionButtonLabel: string;
  className?: string;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export const ConfirmModal = ({
  title,
  description,
  actionButtonLabel,
  className,
  isLoading = false,
  onClose,
  onConfirm,
}: ConfirmModalProps) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const { isClosing, handleClose } = useModalCloseHandler(modalRef, onClose);

  return (
    <Overlay onClickOutside={handleClose} isClosing={isClosing}>
      <div
        ref={modalRef}
        className={clsx(
          styles.confirmModal,
          isClosing && styles.closing,
          className,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <button type='button' className={styles.closeButton}>
          <CrossIcon onClick={handleClose} />
        </button>

        <h6 className={styles.title}>{title}</h6>

        <p className={styles.description}>{description}</p>

        <div className={styles.buttonWrapper}>
          <button onClick={handleClose} className={styles.cancelButton}>
            {CANCEL_TEXT}
          </button>
          <button onClick={onConfirm} className={styles.actionButton}>
            {actionButtonLabel}
            {isLoading && <Loader size='18' />}
          </button>
        </div>
      </div>
    </Overlay>
  );
};
