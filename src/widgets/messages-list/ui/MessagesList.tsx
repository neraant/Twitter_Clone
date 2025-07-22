'use client';

import Image from 'next/image';
import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

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

  const { bottomRef, scrollToBottom } = useChatScroll();
  const {
    messages: realtimeMessages,
    sendMessage,
    markAsRead,
    isConnected,
  } = useRealTimeChat({
    otherUserId: selectedUserId,
    currentUserId,
  });

  const [newMessage, setNewMessage] = useState('');
  const [historicalMessages, setHistoricalMessages] =
    useState<Message[]>(initialMessages);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const hasMarkedAsReadRef = useRef(false);

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
      (m): m is Message =>
        m != null && typeof m === 'object' && 'id' in m && m.id != null,
    );

    const uniqueMessages = validMessages.filter(
      (message, index, self) =>
        index === self.findIndex((m) => m.id === message.id),
    );

    return uniqueMessages.sort((a, b) =>
      (a.created_at || '').localeCompare(b.created_at || ''),
    );
  }, [historicalMessages, realtimeMessages]);

  useEffect(() => {
    if (!isAtBottom) return;

    const unread = allMessages.filter(
      (m) => !m.read && m.sender_id === selectedUserId,
    );

    if (unread.length > 0 && !hasMarkedAsReadRef.current) {
      hasMarkedAsReadRef.current = true;
      const idsToMark = unread.map((m) => m.id);
      console.log('call');
      markAsRead(idsToMark);

      setHistoricalMessages((prev) =>
        prev.map((msg) =>
          idsToMark.includes(msg.id) ? { ...msg, read: true } : msg,
        ),
      );
    }
  }, [allMessages, selectedUserId, markAsRead, isAtBottom]);

  useEffect(() => {
    restoreScrollPosition();
  }, [historicalMessages, restoreScrollPosition]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 50;
      setIsAtBottom(isNearBottom);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [containerRef]);

  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom();
    }
  }, [scrollToBottom, allMessages, isAtBottom]);

  useEffect(() => {
    const main = document.querySelector('main');
    if (main) {
      main.setAttribute('data-layout', 'messages');
    }

    return () => {
      const main = document.querySelector('main');
      if (main) {
        main.setAttribute('data-layout', 'default');
      }
    };
  }, []);

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

  return (
    <div className={styles.messagesList}>
      <MessagesHeader
        userName={selectedName || ''}
        senderUrl={selectedUrl || ''}
        senderId={selectedUserId}
      />

      <div className={styles.messagesContainer}>
        <div ref={containerRef} className={styles.messages}>
          {isLoading && (
            <div className={styles.loadingIndicator}>
              <div className={styles.spinner} />
              <span>Loading...</span>
            </div>
          )}

          {!hasMore && !isLoading && (
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
            const { id, created_at, sender_id, text, read } = message;
            const isFromCurrentUser = sender_id === currentUserId;

            return (
              <div key={id} data-message-date={created_at}>
                <MessageCard
                  content={text || ''}
                  senderName={selectedName!}
                  senderUrl={selectedUrl!}
                  time={created_at || ''}
                  isIncoming={!isFromCurrentUser}
                  isRead={read === true}
                  showReadStatus={isFromCurrentUser}
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
      />
    </div>
  );
};
