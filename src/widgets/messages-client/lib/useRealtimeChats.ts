'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { ChatRoom, Message } from '@/entities/message';
import { createClient } from '@/shared/api/supabase/client';

type useRealtimeChatsProps = {
  initialChats: ChatRoom[] | null;
  currentUserId: string;
};

const EVENT_MESSAGE_TYPE = 'message';
const EVENT_CHAT_UPDATE = 'chat_update';

export const useRealtimeChats = ({
  initialChats,
  currentUserId,
}: useRealtimeChatsProps) => {
  const supabase = createClient();
  const [chats, setChats] = useState<ChatRoom[] | null>(initialChats);
  const [isConnected, setIsConnected] = useState(false);

  const globalChannelRef = useRef<ReturnType<typeof supabase.channel> | null>(
    null,
  );
  const chatChannelsRef = useRef<
    Map<string, ReturnType<typeof supabase.channel>>
  >(new Map());

  useEffect(() => {
    setChats(initialChats);
  }, [initialChats]);

  const updateChatWithNewMessage = useCallback(
    (message: Message) => {
      setChats((prevChats) => {
        if (!prevChats) return prevChats;

        const otherUserId =
          message.sender_id === currentUserId
            ? message.receiver_id
            : message.sender_id;

        return prevChats.map((chat) => {
          if (chat.other_user_id === otherUserId) {
            return {
              ...chat,
              last_message: message.text,
              last_message_time: message.created_at,
            };
          }
          return chat;
        });
      });
    },
    [currentUserId],
  );

  const updateChatInList = useCallback((updatedChat: ChatRoom) => {
    setChats((prevChats) => {
      if (!prevChats) return [updatedChat];

      const existingChatIndex = prevChats.findIndex(
        (chat) => chat.chat_id === updatedChat.chat_id,
      );

      if (existingChatIndex >= 0) {
        const newChats = [...prevChats];
        newChats[existingChatIndex] = updatedChat;
        return newChats;
      } else {
        return [updatedChat, ...prevChats];
      }
    });
  }, []);

  useEffect(() => {
    const globalChannel = supabase.channel(`user_${currentUserId}_global`);
    globalChannelRef.current = globalChannel;

    globalChannel
      .on('broadcast', { event: EVENT_MESSAGE_TYPE }, (payload) => {
        const message = payload.payload as Message;

        if (
          message?.sender_id === currentUserId ||
          message?.receiver_id === currentUserId
        ) {
          updateChatWithNewMessage(message);
        }
      })
      .on('broadcast', { event: EVENT_CHAT_UPDATE }, (payload) => {
        const updatedChat = payload.payload as ChatRoom;
        updateChatInList(updatedChat);
      })
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
      });

    return () => {
      if (globalChannelRef.current) {
        supabase.removeChannel(globalChannelRef.current);
        globalChannelRef.current = null;
      }
    };
  }, [currentUserId, supabase, updateChatInList, updateChatWithNewMessage]);

  useEffect(() => {
    if (!chats || !isConnected) return;

    chatChannelsRef.current.forEach((channel) => {
      supabase.removeChannel(channel);
    });
    chatChannelsRef.current.clear();

    chats.forEach((chat) => {
      const roomName = [chat.other_user_id, currentUserId].sort().join('/');
      const channelName = `chat_${roomName}`;

      if (!chatChannelsRef.current.has(channelName)) {
        const chatChannel = supabase.channel(channelName);

        chatChannel
          .on('broadcast', { event: EVENT_MESSAGE_TYPE }, (payload) => {
            const message = payload.payload as Message;

            if (message?.sender_id !== currentUserId) {
              updateChatWithNewMessage(message);
            }
          })
          .subscribe();

        chatChannelsRef.current.set(channelName, chatChannel);
      }
    });

    const currentChannels = chatChannelsRef.current;

    return () => {
      currentChannels.forEach((channel) => {
        supabase.removeChannel(channel);
      });
      currentChannels.clear();
    };
  }, [chats, currentUserId, isConnected, supabase, updateChatWithNewMessage]);

  return {
    chats,
    isConnected,
    updateChatInList,
  };
};
