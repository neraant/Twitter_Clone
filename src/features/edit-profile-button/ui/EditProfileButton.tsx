import { EDIT_BUTTON } from '../lib';
import styles from './EditProfileButton.module.scss';

type EditProfileButtonProps = {
  onClick?: () => void;
};

export const EditProfileButton = ({ onClick }: EditProfileButtonProps) => {
  return (
    <button type='button' className={styles.button} onClick={onClick}>
      {EDIT_BUTTON}
    </button>
  );
};
