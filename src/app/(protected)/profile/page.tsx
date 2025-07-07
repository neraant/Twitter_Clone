import { Metadata } from 'next';

import { ProfileClient } from '@/widgets/profile-client';

import styles from './profile.module.scss';

export const metadata: Metadata = {
  title: 'Twitter Clone | Profile',
  description: 'This is the profile page',
};

export default async function Profile() {
  return (
    <div className={styles.page}>
      <ProfileClient />
    </div>
  );
}
