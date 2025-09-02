'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { authClient } from '@/lib/auth-client';
import { Loader } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

export default function VerifyRequest() {
  const [otp, setOtp] = useState('');
  const [emailPending, startTransition] = useTransition();
  const params = useSearchParams();
  const email = params.get('email');
  const router = useRouter();
  const otpIsComplete = otp.length === 6;

  const verifyOTP = () => {
    startTransition(async () => {
      // Verify OTP
      await authClient.signIn.emailOtp({
        email: email!,
        otp,
        fetchOptions: {
          onSuccess: () => {
            toast.success('Email verified successfully');
            router.push('/');
          },
          onError: (error) => {
            console.log(error);
            toast.error('Invalid OTP');
          },
        },
      });
    });
  };
  return (
    <Card className='w-full mx-auto'>
      <CardHeader className='text-center'>
        <CardTitle className='text-xl'>Please check your email</CardTitle>
        <CardDescription>
          We have sent a verification code to your email address. Please check
          your email and enter the code below.
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex flex-col items-center space-y-2'>
          <InputOTP
            maxLength={6}
            className='gap-2'
            value={otp}
            onChange={(value) => setOtp(value)}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            {/* <InputOTPSeparator /> */}
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <p className='text-sm text-muted-foreground'>
            Please check your email and enter the 6-digit code.
          </p>
        </div>
        <Button
          className='w-full mt-4'
          onClick={verifyOTP}
          disabled={emailPending || !otpIsComplete}
        >
          {emailPending ? (
            <>
              <Loader className='mr-2 h-4 w-4 animate-spin' />
              Verifying...
            </>
          ) : (
            'Verify Account'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
