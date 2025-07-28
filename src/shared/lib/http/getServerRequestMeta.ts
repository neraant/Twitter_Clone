'use server';

import { cookies, headers } from 'next/headers';

type getServerRequestMetaReturn = {
  cookieHeader: string;
  baseUrl: string;
};

export const getServerRequestMeta =
  async (): Promise<getServerRequestMetaReturn> => {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const headersList = await headers();
    const host = headersList.get('host');
    const protocol = headersList.get('x-forwarded-proto') || 'https';
    const baseUrl = `${protocol}://${host}`;

    return {
      cookieHeader,
      baseUrl,
    };
  };
