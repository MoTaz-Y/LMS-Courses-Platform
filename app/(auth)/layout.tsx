import React from 'react';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='relative flex min-h-svh flex-col items-center justify-center'>
      <div className='flex w-full nax-w-sm flex-col gap-6 '> {children}</div>
    </div>
  );
};

export default AuthLayout;
