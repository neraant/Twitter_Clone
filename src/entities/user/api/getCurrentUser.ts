'use server';

import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';

import { routes } from '@/shared/config/routes';

export const getCurrentUser = async () => {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}${routes.api.getUser}`,
    {
      method: 'GET',
      headers: {
        Cookie: cookieHeader,
      },
      next: { tags: ['user-profile'] },
    },
  );

  if (!res.ok) {
    return null;
  }

  const { user } = await res.json();

  revalidateTag('posts');

  return user;
};
