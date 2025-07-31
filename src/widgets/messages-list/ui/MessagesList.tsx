'use client';

import Image from 'next/image';
import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';

import {
  DEFAULT_THREASHOLD,
  getChatMessages,
  INITIAL_MESSAGES_LIMIT,
  Message,
  MessageCard,
} from '@/entities/message';
import { User } from '@/entities/user';
import { MessageInput } from '@/features/message-input';

import {
  ERROR_TEXT,
  START_MESSAGES_SUBTITLE,
  START_MESSAGES_TITLE,
  useChatScroll,
  useInfinityScroll,
  useRealTimeChat,
} from '../lib';
import { MessagesHeader } from './MessagesHeader';
import styles from './MessagesList.module.scss';

type MessagesListProps = {
  initialMessages: Message[];
  initialHasMore: boolean;
  selectedUser: User;
  currentUser: User;
};

export const MessagesList = ({
  initialMessages = [],
  initialHasMore = true,
  selectedUser,
  currentUser,
}: MessagesListProps) => {
  const {
    id: selectedUserId,
    name: selectedName,
    avatar_url: selectedUrl,
  } = selectedUser;
  const { id: currentUserId } = currentUser;

  const [newMessage, setNewMessage] = useState('');
  const [historicalMessages, setHistoricalMessages] =
    useState<Message[]>(initialMessages);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const { bottomRef, scrollToBottom } = useChatScroll();
  const {
    messages: realtimeMessages,
    sendMessage,
    isConnected,
    isConnecting,
  } = useRealTimeChat({
    otherUserId: selectedUserId,
    currentUserId,
  });

  useEffect(() => {
    setHistoricalMessages(initialMessages);
  }, [selectedUserId, initialMessages]);

  const loadOlderMessages = useCallback(
    async (oldestMessageDate: string) => {
      const result = await getChatMessages(
        selectedUserId,
        INITIAL_MESSAGES_LIMIT,
        oldestMessageDate,
      );
      if (result?.messages) {
        setHistoricalMessages((prev) => [...result.messages, ...prev]);
        return result.messages;
      }
      return [];
    },
    [selectedUserId],
  );

  const { containerRef, isLoading, hasMore, error, restoreScrollPosition } =
    useInfinityScroll({
      onLoadMore: loadOlderMessages,
      threshold: DEFAULT_THREASHOLD,
      initialHasMore,
    });

  const allMessages = useMemo(() => {
    const mergedMessages = [...historicalMessages, ...realtimeMessages];
    const validMessages = mergedMessages.filter(
      (m): m is Message => m?.id != null,
    );

    const uniqueMessagesMap = new Map(
      validMessages.map((msg) => [msg.id, msg]),
    );
    const uniqueMessages = Array.from(uniqueMessagesMap.values());

    return uniqueMessages.sort((a, b) =>
      (a.created_at || '').localeCompare(b.created_at || ''),
    );
  }, [historicalMessages, realtimeMessages]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 50;
      setIsAtBottom(isNearBottom);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [containerRef]);

  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom();
    }
  }, [allMessages, isAtBottom, scrollToBottom]);

  useEffect(() => {
    restoreScrollPosition();
  }, [historicalMessages, restoreScrollPosition]);

  useEffect(() => {
    const main = document.querySelector('main');
    if (main) {
      main.setAttribute('data-layout', 'messages');
      return () => main.setAttribute('data-layout', 'default');
    }
  }, []);

  useEffect(() => {
    const fetchLatestMessages = async () => {
      const result = await getChatMessages(
        selectedUserId,
        INITIAL_MESSAGES_LIMIT,
      );
      if (result?.messages) {
        setHistoricalMessages(result.messages);
      }
    };

    fetchLatestMessages();
  }, [selectedUserId]);

  const handleSendMessage = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (!newMessage.trim() || !isConnected) return;

      sendMessage(newMessage);
      setNewMessage('');
      setTimeout(scrollToBottom, 100);
    },
    [newMessage, isConnected, sendMessage, scrollToBottom],
  );

  const handleScrollToBottom = useCallback(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  const showHasMore =
    !hasMore && !isLoading && !(currentUserId === selectedUserId);

  return (
    <div className={styles.messagesList}>
      <MessagesHeader
        userName={selectedName || ''}
        senderUrl={selectedUrl || ''}
        senderId={selectedUserId}
        isCurrentUserChat={selectedUserId === currentUserId}
      />

      <div className={styles.messagesContainer}>
        <div ref={containerRef} className={styles.messages}>
          {isLoading && (
            <div className={styles.loadingIndicator}>
              <div className={styles.spinner} />
              <span>Loading...</span>
            </div>
          )}

          {showHasMore && (
            <div className={styles.chatStart}>
              <div className={styles.chatStartContent}>
                <Image
                  src={selectedUrl || ''}
                  alt={selectedName || ''}
                  className={styles.chatStartAvatar}
                  width={50}
                  height={50}
                />
                <h3>
                  {START_MESSAGES_TITLE} {selectedName}
                </h3>
                <p>{START_MESSAGES_SUBTITLE}</p>
              </div>
            </div>
          )}

          {error && (
            <div className={styles.errorIndicator}>
              <span>{ERROR_TEXT}</span>
            </div>
          )}

          {allMessages.map((message) => {
            const { id, created_at, sender_id, text } = message;
            const isFromCurrentUser = sender_id === currentUserId;

            return (
              <div key={id} data-message-date={created_at}>
                <MessageCard
                  content={text || ''}
                  senderName={selectedName!}
                  senderUrl={selectedUrl!}
                  time={created_at || ''}
                  isIncoming={!isFromCurrentUser}
                />
              </div>
            );
          })}

          <div ref={bottomRef} />
        </div>

        {!isAtBottom && (
          <div className={styles.scrollToBottomIndicator}>
            <button
              onClick={handleScrollToBottom}
              className={styles.scrollToBottomButton}
            >
              ↓
            </button>
          </div>
        )}
      </div>

      <MessageInput
        value={newMessage}
        setValue={setNewMessage}
        onSend={handleSendMessage}
        disabled={!isConnected}
        isConnecting={isConnecting}
      />
    </div>
  );
};
