import { Metadata } from 'next';

import { getChatsAction } from '@/entities/message';
import { MessagesClient } from '@/widgets/messages-client';

export const dynamic = 'force-dynamic';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'Twitter Clone | Messages',
  description: 'Chat privately with friends 💬',

  openGraph: {
    title: 'Twitter Clone | Messages',
    description: 'Chat privately with friends 💬',
    url: `${BASE_URL}/messages`,
    siteName: 'Twitter Clone',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: `${BASE_URL}/images/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Twitter Clone Messages',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Twitter Clone | Messages',
    description: 'Chat privately with friends 💬',
    images: [`${BASE_URL}/images/og-image.png`],
  },
};

export default async function Messages() {
  try {
    const { chats, userId: currentUserId } = await getChatsAction();

    return <MessagesClient chats={chats} currentUserId={currentUserId} />;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to load chats');
  }
}
