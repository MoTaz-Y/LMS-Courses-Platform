'use client';
import Image from 'next/image';
import Link from 'next/link';
import logo from '@/public/logo.svg';
import { ThemeToggle } from '@/components/ui/themeToggle';
import { authClient } from '@/lib/auth-client';
import { buttonVariants } from '@/components/ui/button';
import UserDropDownMenu from './UserDropDownMenu';

interface NavigationItem {
  name: string;
  href: string;
}

const navigationItems: NavigationItem[] = [
  { name: 'Home', href: '/' },
  { name: 'Courses', href: '/courses' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
  { name: 'Dashboard', href: '/dashboard' },
];
export default function NavBar() {
  const { data: session, isPending } = authClient.useSession();
  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-[backdrop-filter]:bg-background/60'>
      <div className='container flex min-h-16 items-center mx-auto px-4 md:px-6 lg:px-8'>
        <Link href='/' className='flex items-center gap-2'>
          <Image src={logo} alt='Logo' className='size-9' />
          <span className='hidden font-bold sm:inline'>AlmotazLMS</span>
        </Link>
        {/* desktop navigator */}
        <nav className='hidden px-2 md:px-4 md:flex md:flex-1 md:items-center md:justify-between'>
          <div className='flex items-center space-x-4 '>
            {navigationItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className='text-sm font-medium transition-colors text-muted-foreground hover:text-primary'
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className='flex items-center space-x-4'>
            <ThemeToggle />
            {isPending ? null : session ? (
              <UserDropDownMenu
                name={session.user.name}
                email={session.user.email}
                image={session.user.image || ''}
              />
            ) : (
              <>
                <Link
                  href='/login'
                  className={buttonVariants({ variant: 'secondary' })}
                >
                  Login
                </Link>
                <Link href='/login' className={buttonVariants()}>
                  Get Started
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
