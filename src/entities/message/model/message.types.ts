export interface Message {
  created_at: string | null;
  id: string;
  read: boolean | null;
  receiver_id: string | null;
  sender_id: string | null;
  text: string | null;
}

export interface ChatRoom {
  avatar_url: string | null;
  chat_id: string | null;
  last_message: string | null;
  last_message_time: string | null;
  name: string | null;
  other_user_id: string | null;
}
