export async function logout() {
  const res = await fetch('/auth/logout', { method: 'POST' });
  if (!res.ok) {
    throw new Error('Logout failed');
  }
}
