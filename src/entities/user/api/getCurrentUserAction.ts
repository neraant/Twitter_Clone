'use server';

import { routes } from '@/shared/config/routes';
import { getServerRequestMeta } from '@/shared/lib/http';

export const getCurrentUserAction = async () => {
  const { baseUrl, cookieHeader } = await getServerRequestMeta();

  const res = await fetch(`${baseUrl}${routes.api.getUser}`, {
    method: 'GET',
    headers: {
      Cookie: cookieHeader,
    },
    next: { tags: ['user-profile'] },
  });

  if (!res.ok) {
    return null;
  }

  const { user } = await res.json();

  if (!user) {
    return null;
  }

  return user;
};
