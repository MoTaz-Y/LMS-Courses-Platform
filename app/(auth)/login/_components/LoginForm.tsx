'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authClient } from '@/lib/auth-client';
import { GithubIcon, Loader, Mail, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition, useState } from 'react';
import { toast } from 'sonner';
export default function LoginForm() {
  const [socialPending, startSocialTransition] = useTransition();
  const [emailPending, startEmailTransition] = useTransition();
  const [socialType, setSocialType] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();
  const signInwithSocial = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    console.log(event.currentTarget.id);
    setSocialType(event.currentTarget.id);
    const providerId = event.currentTarget.id;
    startSocialTransition(async () => {
      console.log(providerId);
      await authClient.signIn.social({
        /**
         * The social provider ID
         * @example "github", "google", "apple"
         */
        provider: providerId,
        /**
         * A URL to redirect after the user authenticates with the provider
         * @default "/"
         */
        callbackURL: '/',
        fetchOptions: {
          onSuccess: () => {
            toast.success('Login Success you will be redirected automatically');
          },
          onError: (error) => {
            console.log(error);
            toast.error(error.error.message);
          },
        },
      });
    });
  };
  const signInwithEmail = async () => {
    startEmailTransition(async () => {
      await authClient.emailOtp.sendVerificationOtp({
        email: email,
        type: 'sign-in',
        fetchOptions: {
          onSuccess: () => {
            toast.success('OTP sent successfully check your Email');
            router.push(`/verify-request?email=${email}`); //user will be sent as a param
          },
          onError: (error) => {
            console.log(error.error.message);
            toast.error('Error sending Email');
          },
        },
      });
    });
  };
  return (
    <Card>
      <CardHeader className='text-xl'>
        <CardTitle>Welcome Back!</CardTitle>
        <CardDescription>Login to your account</CardDescription>
      </CardHeader>
      <CardContent className='flex flex-col gap-4'>
        <Button
          disabled={socialPending}
          className='w-full'
          variant='outline'
          onClick={signInwithSocial}
          id='github'
        >
          {socialPending && socialType === 'github' ? (
            <>
              <Loader className='mr-2 h-4 w-4 animate-spin' />
              Logging in...
            </>
          ) : (
            <>
              <GithubIcon className='mr-2 h-4 w-4' />
              Login with Github
            </>
          )}
        </Button>
        <Button
          disabled={socialPending}
          className='w-full'
          variant='outline'
          onClick={signInwithSocial}
          id='google'
        >
          {socialPending && socialType === 'google' ? (
            <>
              <Loader className='mr-2 h-4 w-4 animate-spin' />
              Logging in...
            </>
          ) : (
            <>
              <Mail className='mr-2 h-4 w-4' />
              Login with Google
            </>
          )}
        </Button>
        <div className='relative text-center text-sm after:absolute after:top-1/2 after:z-0 after:inset-0 after:flex after:items-center after:border-t after:border-border'>
          <span className='relative z-10 bg-card px-2 text-muted-foreground'>
            Or continue with
          </span>
        </div>
        <div className='grid gap-3'>
          <div className='grid gap-2'>
            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              type='email'
              placeholder='m@example.com'
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {/* <div className='grid gap-2'>
            <Label htmlFor='password'>Password</Label>
            <Input id='password' placeholder='**************' type='password' />
          </div> */}
          <Button
            className='w-full'
            onClick={signInwithEmail}
            disabled={emailPending}
          >
            {emailPending ? (
              <>
                <Loader className='mr-2 h-4 w-4 animate-spin' />
                Loading...
              </>
            ) : (
              <>
                <Send className='mr-2 h-4 w-4' />
                Continue with Email
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
