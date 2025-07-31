'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { Message } from '@/entities/message';
import { sendMessage as sendMessageToDb } from '@/entities/message';
import { createClient } from '@/shared/api/supabase/client';
import { useToast } from '@/shared/lib/toast';

type useRealTimeChatProps = {
  otherUserId: string;
  currentUserId: string;
};

const EVENT_MESSAGE_TYPE = 'message';

export const useRealTimeChat = ({
  otherUserId,
  currentUserId,
}: useRealTimeChatProps) => {
  const supabase = createClient();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const globalChannelRef = useRef<ReturnType<typeof supabase.channel> | null>(
    null,
  );

  const { showToast } = useToast();

  const roomName = [otherUserId, currentUserId].sort().join('/');

  useEffect(() => {
    setMessages([]);
  }, [otherUserId]);

  useEffect(() => {
    setIsConnected(false);
    setIsConnecting(true);

    const newChannel = supabase.channel(`chat_${roomName}`);
    channelRef.current = newChannel;

    newChannel
      .on('broadcast', { event: EVENT_MESSAGE_TYPE }, (payload) => {
        const message = payload.payload as Message;

        if (message?.id && message.sender_id !== currentUserId) {
          setMessages((prev) => {
            const exists = prev.some((m) => m.id === message.id);
            return exists ? prev : [...prev, message];
          });
        }
      })
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
        setIsConnecting(
          status === 'CHANNEL_ERROR' ? false : status !== 'SUBSCRIBED',
        );

        if (status === 'CHANNEL_ERROR') {
          showToast('Error', 'Failed to connect to chat', 'error');
        }
      });

    return () => {
      setIsConnecting(false);
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [roomName, otherUserId, currentUserId, supabase, showToast]);

  useEffect(() => {
    const globalChannel = supabase.channel(`user_${currentUserId}_messages`);
    globalChannelRef.current = globalChannel;

    globalChannel
      .on('broadcast', { event: EVENT_MESSAGE_TYPE }, (payload) => {
        const message = payload.payload as Message;

        if (
          message &&
          (message.sender_id === currentUserId ||
            message.receiver_id === currentUserId)
        ) {
          globalChannel.send({
            type: 'broadcast',
            event: 'chat_list_update',
            payload: message,
          });
        }
      })
      .subscribe();

    return () => {
      if (globalChannelRef.current) {
        supabase.removeChannel(globalChannelRef.current);
        globalChannelRef.current = null;
      }
    };
  }, [currentUserId, supabase]);

  const sendMessage = useCallback(
    async (content: string) => {
      const channel = channelRef.current;
      const globalChannel = globalChannelRef.current;

      if (!channel || !globalChannel || !isConnected || !content.trim()) return;

      const message: Message = {
        id: crypto.randomUUID(),
        text: content.trim(),
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

        await globalChannel.send({
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
    [isConnected, otherUserId, currentUserId, showToast],
  );

  useEffect(() => {
    return () => {
      setMessages([]);
    };
  }, []);

  return {
    messages,
    isConnected,
    isConnecting,
    sendMessage,
  };
};
