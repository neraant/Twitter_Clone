import clsx from 'clsx';
import Image from 'next/image';

import { User } from '../../model';
import styles from './UserBigCard.module.scss';

type UserForProps = Pick<User, 'name' | 'avatar_url' | 'user_telegram' | 'bio'>;

export type UserBigCardProps = {
  className?: string;
  user?: UserForProps | null;
};

const DefaultAvatar = '/images/user-avatar.png';

export const UserBigCard = ({ user, className }: UserBigCardProps) => {
  if (!user) return null;

  const { avatar_url, name, user_telegram, bio } = user;

  return (
    <div className={clsx(styles.wrapper, className)}>
      <Image
        src={avatar_url || DefaultAvatar}
        alt='avatar'
        width={180}
        height={180}
        className={styles.icon}
        priority
      />

      <div className={styles.userInfo}>
        <span className={styles.name} title={name!}>
          {name}
        </span>
        {user_telegram && (
          <span className={styles.telegram}>{user_telegram}</span>
        )}
      </div>

      {bio && <p className={styles.bio}>{bio}</p>}
    </div>
  );
};
