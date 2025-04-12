'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from './AuthProvider';
import Navigation from '@/components/ui/Navigation';

const publicPaths = ['/login', '/register', '/forgot-password'];

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const isPublicPath = publicPaths.includes(pathname);

  // Don't show navigation on public paths
  if (isPublicPath) {
    return <>{children}</>;
  }

  // Show navigation for authenticated users
  if (user) {
    return (
      <>
        <Navigation />
        <main className="mx-auto mt-16 max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
      </>
    );
  }

  // Redirect to login page for unauthenticated users
  // The actual redirect will be handled by route protection
  return <>{children}</>;
}
