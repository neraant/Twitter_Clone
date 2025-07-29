import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Twitter Clone | Notifications',
  description: 'This is the notifications page',
};

export default async function Notifications() {
  return (
    <div>
      <h1>Notifications</h1>
    </div>
  );
}
