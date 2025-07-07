import { EditProfileButton } from '@/features/edit-profile-button';
import { FollowButton } from '@/features/follow-button/ui';

import styles from './ProfileAction.module.scss';

type ProfileActionProps = {
  isOwner: boolean;
  userId?: string;
  onEditProfileClick: () => void;
};

export const ProfileAction = ({
  isOwner,
  userId,
  onEditProfileClick,
}: ProfileActionProps) => {
  return (
    <div className={styles.action}>
      {!isOwner ? (
        <FollowButton targetUserId={userId} />
      ) : (
        <EditProfileButton onClick={onEditProfileClick} />
      )}
    </div>
  );
};
