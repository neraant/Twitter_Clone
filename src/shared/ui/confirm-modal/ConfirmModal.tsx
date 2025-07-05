import { useRef, useState } from 'react';

import { CANCEL_TEXT } from '@/shared/lib/confirm-modal';
import { useClickOutside } from '@/shared/lib/hooks';

import { CrossIcon } from '../icon';
import { Overlay } from '../overlay';
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
  const ref = useRef<HTMLDivElement | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  useClickOutside(ref, () => {
    handleClose();
  });

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  return (
    <Overlay onClickOutside={handleClose} isClosing={isClosing}>
      <div
        ref={ref}
        className={`${styles.confirmModal} ${isClosing ? styles.closing : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button type='button' className={styles.closeButton}>
          <CrossIcon onClick={handleClose} />
        </button>

        <span className={styles.title}>{title}</span>

        <p className={styles.description}>{description}</p>

        <div className={styles.buttonWrapper}>
          <button onClick={handleClose} className={styles.cancelButton}>
            {CANCEL_TEXT}
          </button>
          <button onClick={onConfirm} className={styles.actionButton}>
            {actionButtonLabel}
          </button>
        </div>
      </div>
    </Overlay>
  );
};
