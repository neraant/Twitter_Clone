'use client';

import { useCallback, useRef } from 'react';

export function useChatScroll() {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const isFirstScroll = useRef(true);

  const scrollToBottom = useCallback(() => {
    if (!bottomRef.current) return;

    bottomRef.current.scrollIntoView({
      behavior: isFirstScroll.current ? 'auto' : 'smooth',
    });

    isFirstScroll.current = false;
  }, []);

  return { bottomRef, scrollToBottom };
}
