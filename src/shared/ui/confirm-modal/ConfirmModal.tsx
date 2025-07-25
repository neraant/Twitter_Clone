'use client';

import { CANCEL_TEXT } from '@/shared/lib/confirm-modal';

import { BaseModal } from '../base-modal/BaseModal';
import { CrossIcon } from '../icon';
import styles from './ConfirmModal.module.scss';

type ConfirmModalProps = {
  title: string;
  description: string;
  actionButtonLabel: string;
  onClose: () => void;
  onConfirm: () => void;
};

export const ConfirmModal = ({
  title,
  description,
  actionButtonLabel,
  onClose,
  onConfirm,
}: ConfirmModalProps) => {
  return (
    <BaseModal onClose={onClose}>
      <button type='button' className={styles.closeButton} onClick={onClose}>
        <CrossIcon />
      </button>

      <span className={styles.title}>{title}</span>
      <p className={styles.description}>{description}</p>

      <div className={styles.buttonWrapper}>
        <button onClick={onClose} className={styles.cancelButton}>
          {CANCEL_TEXT}
        </button>
        <button onClick={onConfirm} className={styles.actionButton}>
          {actionButtonLabel}
        </button>
      </div>
    </BaseModal>
  );
};
