'use server';

import { NextRequest } from 'next/server';

import { CRAWLER_AGENTS } from './seo.constants';

export function isCrawler(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || '';
  return CRAWLER_AGENTS.some((agent) => userAgent.includes(agent));
}
