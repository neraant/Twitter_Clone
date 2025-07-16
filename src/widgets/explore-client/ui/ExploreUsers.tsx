import { User, UserSmallCard } from '@/entities/user';

import styles from './ExploreClient.module.scss';

export const ExploreUsers = ({ users }: { users: User[] }) => {
  return users.map((user) => (
    <UserSmallCard key={user.id} user={user} className={styles.userCard} />
  ));
};
