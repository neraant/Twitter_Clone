import Link from 'next/link';

export default function AuthError() {
  return (
    <div>
      <h1>Authentication Error</h1>
      <p>Something went wrong during authentication.</p>
      <Link href='/'>Go back to home</Link>
    </div>
  );
}
