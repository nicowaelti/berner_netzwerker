import { PropsWithChildren } from 'react';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import Navigation from '@/components/ui/Navigation';
import { LoadingPage } from '@/components/ui/loading';

// This layout is server-side rendered and will check the session cookie
export default async function DashboardLayout({ children }: PropsWithChildren) {
  // Check if we have a session cookie
  const headersList = headers();
  const cookies = headersList.get('cookie') || '';
  const hasSession = cookies.includes('__session=');

  if (!hasSession) {
    redirect('/login');
  }

  return (
    <>
      <Navigation />
      <main className="mx-auto mt-16 max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </>
  );
}

// Loading state shown while the dashboard pages are loading
export function Loading() {
  return <LoadingPage />;
}
