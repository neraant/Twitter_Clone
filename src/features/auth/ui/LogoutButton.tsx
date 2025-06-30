'use client';

import { useRouter } from 'next/navigation';

import { routes } from '@/shared/config/routes';
import { LoaderIcon } from '@/shared/ui/icon';

import { useAuth } from '../model';
import styles from './LogoutButton.module.scss';

export const LogoutButton = () => {
  const router = useRouter();
  const logout = useAuth((state) => state.logout);
  const isLoading = useAuth((state) => state.isLoading);

  const handleLogout = async () => {
    try {
      await logout();
      router.replace(routes.auth.signUpMain);
    } catch (error) {
      console.error('Error while logout: ', error);
    } finally {
    }
  };

  return (
    <button
      onClick={handleLogout}
      className={styles.button}
      disabled={isLoading}
      aria-label='logout'
    >
      Logout
      {isLoading && (
        <LoaderIcon className={styles.loader} width={18} height={18} />
      )}
    </button>
  );
};
