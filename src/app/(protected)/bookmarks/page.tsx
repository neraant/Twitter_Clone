import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Twitter Clone | Bookmarks',
  description: 'This is the bookmarks page',
};

export default async function Bookmarks() {
  return (
    <div>
      <h1>Bookmarks</h1>
    </div>
  );
}
