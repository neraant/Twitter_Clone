import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Twitter Clone | Messages',
  description: 'This is the messages page',
};

export default async function Messages() {
  return (
    <div>
      <h1>Messages</h1>
    </div>
  );
}
