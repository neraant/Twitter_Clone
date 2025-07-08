'use server';

import { cookies } from 'next/headers';

export const getCurrentUserAction = async () => {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/users`, {
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
  return user;
};
