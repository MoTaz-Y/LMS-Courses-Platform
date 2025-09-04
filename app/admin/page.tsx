'use client';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { ChartAreaInteractive } from '@/components/sidebar/chart-area-interactive';
import { DataTable } from '@/components/sidebar/data-table';
import { SectionCards } from '@/components/sidebar/section-cards';
import { SiteHeader } from '@/components/sidebar/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

import data from './data.json';
import { authClient } from '@/lib/auth-client';
import { Loader } from 'lucide-react';
import { redirect } from 'next/navigation';

export default function Page() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending)
    return (
      <div className='flex h-screen w-screen items-center justify-center'>
        <Loader className='h-10 w-10 animate-spin' />
        <p className='text-lg'>Loading...</p>
      </div>
    );
  if (!session) {
    redirect('/');
  }
  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <AppSidebar variant='inset' />
      <SidebarInset>
        <SiteHeader />
        <div className='flex flex-1 flex-col'>
          <div className='@container/main flex flex-1 flex-col gap-2'>
            <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
              <SectionCards />
              <div className='px-4 lg:px-6'>
                <ChartAreaInteractive />
              </div>
              <DataTable data={data} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
