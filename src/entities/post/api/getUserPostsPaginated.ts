'use server';

import { routes } from '@/shared/config/routes';

export const getUserPostsPaginated = async (
  userId: string,
  cursor: string | null,
) => {
  const params = new URLSearchParams();
  params.append('limit', '10');
  if (cursor) params.append('cursor', cursor);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}${routes.api.getTweets}/${userId}?${params}`,
    {
      cache: 'no-store',
    },
  );

  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
};
