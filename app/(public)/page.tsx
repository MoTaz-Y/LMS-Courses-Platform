'use client';

import { Badge } from '@/components/ui/badge';
import { authClient } from '@/lib/auth-client';
import { Loader } from 'lucide-react';
import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { toast } from 'sonner';
import FeatureCard from './_components/FeatureCard';
import { buttonVariants } from '@/components/ui/button';

export default function Home() {
  const { data: session, isPending } = authClient.useSession();
  // const router = useRouter();

  if (isPending)
    return (
      <div className='flex flex-col gap-4 items-center justify-center h-screen'>
        <Loader className='animate-spin' />
        <p>Loading...</p>
      </div>
    );
  // const SignOut = async () => {
  //   await authClient.signOut({
  //     fetchOptions: {
  //       onSuccess: () => {
  //         router.push('/');
  //         toast.success('Logged out successfully');
  //       },
  //     },
  //   });
  // };
  return (
    <>
      <section className='relative py-20'>
        <div className='flex flex-col items-center text-center space-y-8'>
          <Badge variant='outline'>future of online learning</Badge>
          <h1 className='text-4xl md:text-6xl font-bold tracking-tight'>
            Elevate your learning experience
          </h1>
          <p className='max-w-[700px] text-muted-foreground md:text-xl'>
            Discover a new way to learn with our moden, interactive learning
            management system. Access high-quality courses from anywhere, at any
            time.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 mt-8'>
            <Link className={buttonVariants({ size: 'lg' })} href='/courses'>
              Browse courses
            </Link>
            {!session ? (
              <Link
                className={buttonVariants({ variant: 'outline', size: 'lg' })}
                href='/sign-in'
              >
                Get started
              </Link>
            ) : (
              <Link
                className={buttonVariants({ variant: 'outline', size: 'lg' })}
                href='/dashboard'
              >
                Dashboard
              </Link>
            )}
          </div>
        </div>
      </section>
      <section className='w-full max-w-6xl mx-auto py-10'>
        <FeatureCard />
      </section>
    </>
  );
}
