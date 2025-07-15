import { redirect } from 'next/navigation';

import { getCurrentUserAction } from '@/entities/user/api';
import { routes } from '@/shared/config/routes';

export default async function RootPage() {
  const user = await getCurrentUserAction();

  if (user) {
    redirect(routes.app.home);
  } else {
    redirect(routes.auth.signUpMain);
  }
}
