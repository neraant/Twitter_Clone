'use client';

import {
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
  useEffect,
  useRef,
} from 'react';

import { SendIcon } from '@/shared/ui/icon';

import { MAX_HEIGHT, MIN_HEIGHT, PLACEHOLDER } from '../lib';
import styles from './MessageInput.module.scss';

type MessageInputProps = {
  value: string;
  setValue: (value: string) => void;
  onSend: (e: FormEvent) => void;
  disabled?: boolean;
  isConnecting?: boolean;
};

export const MessageInput = ({
  value,
  setValue,
  onSend,
  disabled = false,
  isConnecting = false,
}: MessageInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend(e as unknown as FormEvent);
    }
  };

  const handleMessageChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  const getPlaceholder = () => {
    if (isConnecting) return 'Connecting to chat...';
    if (disabled) return 'Chat is offline';
    return PLACEHOLDER;
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = MIN_HEIGHT + 'px';

      if (value.trim()) {
        const scrollHeight = textarea.scrollHeight;
        const newHeight = Math.max(
          MIN_HEIGHT,
          Math.min(scrollHeight, MAX_HEIGHT),
        );
        textarea.style.height = newHeight + 'px';
      }
    }
  }, [value]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = MIN_HEIGHT + 'px';
    }
  }, []);

  return (
    <form className={styles.messageInput} onSubmit={onSend}>
      <textarea
        ref={textareaRef}
        disabled={disabled || isConnecting}
        placeholder={getPlaceholder()}
        aria-label='Enter your message'
        className={styles.input}
        value={value}
        onChange={handleMessageChange}
        onKeyDown={handleKeyDown}
        rows={1}
      />

      <button
        disabled={disabled || isConnecting || !value.trim()}
        className={styles.sendButton}
      >
        <SendIcon width={24} height={24} />
      </button>
    </form>
  );
};
