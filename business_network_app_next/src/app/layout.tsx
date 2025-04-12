import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { LayoutProvider } from '@/components/providers/LayoutProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Berner Netzwerker',
  description: 'Verbinde dich mit Geschäftsprofis in Bern',
  keywords: 'Business, Networking, Bern, Schweiz, Freelancer, Jobs',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className={inter.className}>
      <body className="min-h-screen bg-white antialiased">
        <AuthProvider>
          <LayoutProvider>{children}</LayoutProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
