'use server';

import { cookies } from 'next/headers';

import { Post } from '@/entities/post';
import { routes } from '@/shared/config/routes';

export const createPostAction = async (payload: Post) => {
  try {
    const cookie = await cookies();
    const cookieHeader = cookie.toString();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}${routes.api.createPost}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Cookie: cookieHeader },
        body: JSON.stringify(payload),
      },
    );

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error?.message || 'Error while sending post');
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};
