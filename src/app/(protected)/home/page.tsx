import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Twitter Clone | Home',
  description: 'This is the home page',
};

export default async function Home() {
  return (
    <div>
      <h1>Home page</h1>
    </div>
  );
}
