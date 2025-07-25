'use client';

import clsx from 'clsx';
import React, { ReactNode, useEffect, useState } from 'react';

import { useToastContext } from '@/shared/lib/toast/ToastContext';
import { ToastType } from '@/shared/lib/toast/ToastContext';

import { ErrorIcon, SuccessIcon } from '../icon';
import styles from './ToastContainer.module.scss';

const ToastIconMap: Record<ToastType, ReactNode> = {
  success: <SuccessIcon className={styles.toastIcon} width={24} height={24} />,
  error: <ErrorIcon className={styles.toastIcon} width={24} height={24} />,
};

type ToastProps = {
  id: number;
  title: string;
  message: string;
  type: ToastType;
  onRemove: (id: number) => void;
};

const TOAST_TIMEOUT = 3000;
const TOAST_DISAPPEARING = 300;

const Toast = ({ id, title, message, type, onRemove }: ToastProps) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsClosing(true);
      setTimeout(() => onRemove(id), TOAST_DISAPPEARING);
    }, TOAST_TIMEOUT);

    return () => clearTimeout(timer);
  }, [id, onRemove]);

  return (
    <div
      className={clsx(styles.toast, styles[type], {
        [styles.fadeOut]: isClosing,
      })}
      onClick={() => onRemove(id)}
    >
      {ToastIconMap[type]}
      <div className={styles.content}>
        <h6 className={styles.title}>{title}</h6>
        <p className={styles.body}>{message}</p>
      </div>
    </div>
  );
};

export const ToastContainer = () => {
  const { toasts, removeToast } = useToastContext();

  return (
    <div className={styles.container}>
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onRemove={removeToast} />
      ))}
    </div>
  );
};
