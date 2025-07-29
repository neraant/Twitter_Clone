import type { MetadataRoute } from 'next';

import { BASE_URL } from '@/shared/lib/common';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/welcome', '/login', '/register', '/profile/', '/post/'],
        disallow: ['/home/', '/search/'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
