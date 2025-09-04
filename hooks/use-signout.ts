'use client';

import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const useSignout = () => {
  const router = useRouter();
  const SignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/');
          toast.success('Logged out successfully');
        },
        onError: () => {
          toast.error('Failed to logout');
        },
      },
    });
  };
  return SignOut;
};
