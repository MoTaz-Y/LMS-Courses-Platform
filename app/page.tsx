'use client';

import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/themeToggle';
import { authClient } from '@/lib/auth-client';
import { Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function Home() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  if (isPending)
    return (
      <div className='flex flex-col gap-4 items-center justify-center h-screen'>
        <Loader className='animate-spin' />
        <p>Loading...</p>
      </div>
    );
  const SignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/');
          toast.success('Logged out successfully');
        },
      },
    });
  };
  return (
    <div className='font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20'>
      <ThemeToggle />
      {session ? (
        <>
          <p> welcome back {session.user.name}</p>
          <Button onClick={SignOut}>Logout</Button>
        </>
      ) : (
        <>
          <p> you are not logged in</p>
          <Button>Login</Button>
        </>
      )}
    </div>
  );
}
