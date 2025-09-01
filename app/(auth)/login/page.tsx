import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { GithubIcon } from 'lucide-react';
const page = () => {
  return (
    <Card>
      <CardHeader className='text-xl'>
        <CardTitle>Welcome Back!</CardTitle>
        <CardDescription>Login to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <Button className='w-full' variant='outline'>
          <GithubIcon className='mr-2 h-4 w-4' />
          Login with Github
        </Button>
      </CardContent>
    </Card>
  );
};

export default page;
