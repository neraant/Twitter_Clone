import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getUserById } from '@/entities/user/api';
import { isValidUUID } from '@/shared/lib/isValidUUID';
import { ProfileClient } from '@/widgets/profile-client';

import styles from '../profile.module.scss';

export const metadata: Metadata = {
  title: 'Twitter Clone | Profile',
  description: 'This is the profile page',
};

export default async function Profile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!isValidUUID(id)) return notFound();

  const user = await getUserById(id);

  if (!user) return notFound();

  return (
    <div className={styles.page}>
      <ProfileClient userId={id} />
    </div>
  );
}
