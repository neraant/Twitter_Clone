'use client';

import { useCallback, useEffect, useState } from 'react';

import { Message } from '@/entities/message';
import {
  markAsRead as markAsReadToDb,
  sendMessage as sendMessageToDb,
} from '@/entities/message';
import { createClient } from '@/shared/api/supabase/client';
import { useToast } from '@/shared/lib/toast';

type useRealTimeChatProps = {
  otherUserId: string;
  currentUserId: string;
};

const EVENT_MESSAGE_TYPE = 'message';
const EVENT_READ_STATUS = 'read_status';

export const useRealTimeChat = ({
  otherUserId,
  currentUserId,
}: useRealTimeChatProps) => {
  const supabase = createClient();
  const [messages, setMessages] = useState<Message[]>([]);
  const [channel, setChannel] = useState<ReturnType<
    typeof supabase.channel
  > | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const { showToast } = useToast();

  const roomName = [otherUserId, currentUserId].sort().join('/');

  useEffect(() => {
    const newChannel = supabase.channel(roomName);

    newChannel
      .on('broadcast', { event: EVENT_MESSAGE_TYPE }, (payload) => {
        const message = payload.payload as Message;

        if (message?.id) {
          setMessages((prev) => {
            const exists = prev.some((m) => m.id === message.id);
            return exists ? prev : [...prev, message];
          });
        }
      })
      .on('broadcast', { event: EVENT_READ_STATUS }, (payload) => {
        const { messageIds, userId: readerUserId } = payload.payload as {
          messageIds: string[];
          userId: string;
        };

        if (readerUserId === otherUserId) {
          setMessages((prev) =>
            prev.map((m) =>
              messageIds.includes(m.id) ? { ...m, read: true } : m,
            ),
          );
        }
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setIsConnected(true);
        }
      });

    setChannel(newChannel);

    return () => {
      supabase.removeChannel(newChannel);
    };
  }, [roomName, otherUserId, supabase]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!channel || !isConnected) return;

      const message: Message = {
        id: crypto.randomUUID(),
        text: content,
        sender_id: currentUserId,
        receiver_id: otherUserId,
        created_at: new Date().toISOString(),
        read: false,
      };

      setMessages((prev) => [...prev, message]);

      try {
        await channel.send({
          type: 'broadcast',
          event: EVENT_MESSAGE_TYPE,
          payload: message,
        });

        await sendMessageToDb(message);
      } catch (error) {
        console.error('Failed to send message:', error);
        setMessages((prev) => prev.filter((m) => m.id !== message.id));
        showToast('Error', 'Failed to send message', 'error');
      }
    },
    [channel, isConnected, otherUserId, currentUserId, showToast],
  );

  const markAsRead = useCallback(
    async (messageIds: string[]) => {
      if (!channel || !isConnected || messageIds.length === 0) return;

      setMessages((prev) =>
        prev.map((msg) =>
          messageIds.includes(msg.id) &&
          msg.sender_id === otherUserId &&
          !msg.read
            ? { ...msg, read: true }
            : msg,
        ),
      );

      try {
        await channel.send({
          type: 'broadcast',
          event: EVENT_READ_STATUS,
          payload: {
            messageIds,
            userId: currentUserId,
          },
        });

        await markAsReadToDb(messageIds);
      } catch (error) {
        console.error('Failed to mark messages as read:', error);
      }
    },
    [channel, currentUserId, isConnected, otherUserId],
  );

  return { messages, isConnected, sendMessage, markAsRead };
};
