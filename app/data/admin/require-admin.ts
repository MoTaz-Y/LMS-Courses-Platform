import 'server-only';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export async function requireAdmin() {
  const sesstion = await auth.api.getSession({
    headers: await headers(),
  });
  if (!sesstion) {
    return redirect('/login');
  }
  if (sesstion.user.role !== 'admin') {
    return redirect('/not-admin');
  }
  return sesstion;
}
