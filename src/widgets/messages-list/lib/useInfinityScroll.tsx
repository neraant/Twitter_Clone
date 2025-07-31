'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { Message } from '@/entities/message';

type useInfinityScrollProps = {
  onLoadMore: (oldestMessageDate: string) => Promise<Message[]>;
  threshold: number;
  initialHasMore?: boolean;
};

export const useInfinityScroll = ({
  onLoadMore,
  threshold,
  initialHasMore,
}: useInfinityScrollProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [error, setError] = useState<string | null>(null);

  const previousScrollHeight = useRef(0);
  const shouldRestoreScroll = useRef(false);

  const loadMore = useCallback(
    async (oldestDate: string) => {
      if (isLoading || !hasMore) return;

      setIsLoading(true);
      setError(null);

      const container = containerRef.current;
      if (container) {
        previousScrollHeight.current = container.scrollHeight;
        shouldRestoreScroll.current = true;
      }
      try {
        const newMessages = await onLoadMore(oldestDate);

        if (!newMessages || newMessages.length === 0) {
          setHasMore(false);
        }

        return newMessages;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load messages',
        );
        setHasMore(false);
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, hasMore, onLoadMore],
  );

  const restoreScrollPosition = useCallback(() => {
    const container = containerRef.current;
    if (container && shouldRestoreScroll.current) {
      const currentScrollHeight = container.scrollHeight;
      const scrollDiff = currentScrollHeight - previousScrollHeight.current;

      container.scrollTop = container.scrollTop + scrollDiff;
      shouldRestoreScroll.current = false;
    }
  }, []);

  const handleScroll = useCallback(
    (event: Event) => {
      const container = event.target as HTMLDivElement;

      if (container.scrollTop <= threshold && !isLoading && hasMore) {
        const messages = container.querySelectorAll('[data-message-date]');
        if (messages.length > 0) {
          const oldestMessage = messages[0] as HTMLElement;
          const oldestDate = oldestMessage.dataset.messageDate;
          if (oldestDate) {
            loadMore(oldestDate);
          }
        }
      }
    },
    [threshold, isLoading, hasMore, loadMore],
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return {
    containerRef,
    isLoading,
    hasMore,
    error,
    loadMore,
    restoreScrollPosition,
    setHasMore,
  };
};
