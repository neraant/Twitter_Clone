import { cookies } from 'next/headers';

import { routes } from '@/shared/config/routes';

import { User } from '../model';

export const getUserByIdAction = async (id: string): Promise<User | null> => {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}${routes.api.getUser}/${id}`,
    {
      method: 'GET',
      headers: {
        Cookie: cookieHeader,
      },
      next: { tags: [`user-${id}`] },
    },
  );

  if (!res.ok) {
    return null;
  }

  const { user } = await res.json();
  return user;
};
