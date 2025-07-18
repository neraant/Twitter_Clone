'use client';

import { useRef, useState } from 'react';

import { useTheme } from '@/features/toggle-theme/lib';
import {
  useClickOutside,
  useLockBodyScroll,
  useLogout,
} from '@/shared/lib/hooks';
import { THEMES } from '@/shared/lib/theme';
import { ConfirmModal } from '@/shared/ui/confirm-modal';

import { ACTIONS, LOGOUT_ACTION, THEME_ACTION } from '../lib';
import styles from './MoreActions.module.scss';

type MoreActionsProps = {
  onClose: () => void;
};

export const MoreActions = ({ onClose }: MoreActionsProps) => {
  const ref = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { theme, setTheme } = useTheme();
  const { handleLogout } = useLogout();

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleActionClick = (action: string) => {
    switch (action) {
      case LOGOUT_ACTION: {
        handleOpenModal();
        break;
      }
      case THEME_ACTION: {
        setTheme(theme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT);
        onClose();
        break;
      }
      default: {
        break;
      }
    }
  };

  useClickOutside(ref, isModalOpen ? () => {} : onClose);
  useLockBodyScroll(isModalOpen);

  return (
    <div ref={ref}>
      {isModalOpen && (
        <ConfirmModal
          title='Confirm logout'
          description='Are you sure you wanna logout?'
          actionButtonLabel='Logout'
          onClose={handleCloseModal}
          onConfirm={handleLogout}
          className='confirmLogout'
        />
      )}

      <div className={styles.actionsWrapper}>
        <ul className={styles.actionsList}>
          {ACTIONS.map(({ label, action, icon }) => (
            <li key={`action_${action}`} className={styles.actionListItem}>
              <button
                type='button'
                aria-label={action}
                className={styles.actionButton}
                onClick={() => handleActionClick(action)}
              >
                {icon}
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
