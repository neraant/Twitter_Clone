import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';

import { User } from '../../model';
import styles from './UserBigCard.module.scss';

type UserForProps = Pick<User, 'name' | 'avatar_url' | 'user_telegram' | 'bio'>;

export type UserBigCardProps = {
  className?: string;
  user?: UserForProps | null;
};

const DefaultAvatar = '/images/user-avatar.webp';

export const UserBigCard = ({ user, className }: UserBigCardProps) => {
  if (!user) return null;

  const { avatar_url, name, user_telegram, bio } = user;

  const cleanTelegramUsername = user_telegram?.startsWith('@')
    ? user_telegram.slice(1)
    : user_telegram;

  return (
    <div className={clsx(styles.wrapper, className)}>
      <Image
        src={avatar_url || DefaultAvatar}
        alt='avatar'
        width={180}
        height={180}
        className={styles.icon}
        data-testid='user-avatar'
        priority
      />

      <div className={styles.userInfo}>
        <p data-testid='user-name' className={styles.name} title={name!}>
          {name}
        </p>
        {user_telegram && (
          <Link
            className={styles.telegram}
            href={`https://t.me/${cleanTelegramUsername}`}
            aria-label={`${name}'s telegram`}
            target='_blank'
            data-testid='user-telegram'
          >
            {user_telegram}
          </Link>
        )}
      </div>

      {bio && (
        <p data-testid='user-bio' className={styles.bio}>
          {bio}
        </p>
      )}
    </div>
  );
};
