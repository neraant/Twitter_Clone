'use server';

import { routes } from '@/shared/config/routes';
import { getServerRequestMeta } from '@/shared/lib/http';

import { User } from '../model';

export const getUserByIdAction = async (id: string): Promise<User | null> => {
  const { baseUrl, cookieHeader } = await getServerRequestMeta();

  const res = await fetch(`${baseUrl}${routes.api.getUser}/${id}`, {
    method: 'GET',
    headers: {
      Cookie: cookieHeader,
    },
    next: { tags: [`user-${id}`] },
  });

  if (!res.ok) {
    return null;
  }

  const { user } = await res.json();
  return user;
};
