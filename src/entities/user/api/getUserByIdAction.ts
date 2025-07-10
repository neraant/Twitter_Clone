import { cookies, headers } from 'next/headers';

import { routes } from '@/shared/config/routes';

import { User } from '../model';

export const getUserByIdAction = async (id: string): Promise<User | null> => {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const headersList = await headers();
  const host = headersList.get('host');
  const protocol = headersList.get('x-forwarded-proto') || 'https';
  const baseUrl = `${protocol}://${host}`;

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
