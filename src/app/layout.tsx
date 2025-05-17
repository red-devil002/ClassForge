import './globals.css';
import { Toaster } from 'react-hot-toast';
import type { Metadata } from 'next';
import { AuthProvider } from '@/context/auth-context';
import { RootLayoutContent } from '@/components/layout/dashboard-layout';

export const metadata: Metadata = {
  title: 'Class Forge',
  description: 'AI Integrated',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <RootLayoutContent>{children}</RootLayoutContent>
          <Toaster position="top-right" reverseOrder={false} />
        </AuthProvider>
      </body>
    </html>
  );
}