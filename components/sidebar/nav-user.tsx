'use client';

import {
  IconDotsVertical,
  IconLogout,
  IconSettings,
  IconUserCircle,
} from '@tabler/icons-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { authClient } from '@/lib/auth-client';
import { HomeIcon, Loader, Tv2 } from 'lucide-react';
import Link from 'next/link';
import { useSignout } from '@/hooks/use-signout';

export function NavUser() {
  const { isMobile } = useSidebar();
  const { data: session, isPending } = authClient.useSession();
  const SignOut = useSignout();
  if (isPending) return <Loader className='h-4 w-4 animate-spin' />;
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <Avatar className='h-8 w-8 rounded-lg grayscale'>
                <AvatarImage
                  src={
                    session?.user.image ||
                    `https://avatar.vercel.sh/${session?.user.email}`
                  }
                  alt={session?.user.name}
                />
                <AvatarFallback className='rounded-lg'>
                  {session?.user.name && session?.user.name.length > 0
                    ? session?.user.name
                        .split(' ')
                        .map((name) => name[0])
                        .join('')
                        .toUpperCase()
                    : session?.user.email[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-medium'>
                  {session?.user.name && session?.user.name.length > 0
                    ? session?.user.name
                    : session?.user.email.split('@')[0]}
                </span>
                <span className='text-muted-foreground truncate text-xs'>
                  {session?.user.email}
                </span>
              </div>
              <IconDotsVertical className='ml-auto size-4' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
            side={isMobile ? 'bottom' : 'right'}
            align='end'
            sideOffset={4}
          >
            <DropdownMenuLabel className='p-0 font-normal'>
              <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                <Avatar className='h-8 w-8 rounded-lg'>
                  <AvatarImage
                    src={
                      session?.user.image ||
                      `https://avatar.vercel.sh/${session?.user.email}`
                    }
                    alt={session?.user.name}
                  />
                  <AvatarFallback className='rounded-lg'>
                    {session?.user.name && session?.user.name.length > 0
                      ? session?.user.name
                          .split(' ')
                          .map((name) => name[0])
                          .join('')
                          .toUpperCase()
                      : session?.user.email[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-medium'>
                    {session?.user.name && session?.user.name.length > 0
                      ? session?.user.name
                      : session?.user.email.split('@')[0]}
                  </span>
                  <span className='text-muted-foreground truncate text-xs'>
                    {session?.user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href='/profile'>
                  <IconUserCircle />
                  Account
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href='/profile/settings'>
                  <IconSettings />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href='/admin/courses'>
                  <Tv2 />
                  Courses
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href='/'>
                  <HomeIcon />
                  Home
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={SignOut}>
              <IconLogout />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
