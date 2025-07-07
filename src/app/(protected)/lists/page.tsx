import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Twitter Clone | Lists',
  description: 'This is the lists page',
};

export default async function Lists() {
  return (
    <div>
      <h1>Lists</h1>
    </div>
  );
}
