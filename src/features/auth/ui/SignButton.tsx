import { LoaderIcon } from '../../../shared/ui/icon';
import styles from './SignButton.module.scss';

type SignButtonProps = {
  label: string;
  isLoading?: boolean;
};

export const SignButton = ({ label, isLoading = false }: SignButtonProps) => {
  return (
    <button
      type='submit'
      aria-label='sign'
      disabled={isLoading}
      className={styles.button}
    >
      {label}
      {isLoading && (
        <LoaderIcon height={22} width={22} className={styles.loader} />
      )}
    </button>
  );
};
