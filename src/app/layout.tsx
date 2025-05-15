import './globals.css';
import { Toaster } from 'react-hot-toast';
import type { Metadata } from 'next';
import { AuthProvider } from '@/context/auth-context'

export const metadata: Metadata = {
  title: 'Class Gen',
  description: 'AI Integrated',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
      <AuthProvider>
        {children}
        <Toaster position="top-right" reverseOrder={false} />
      </AuthProvider>
      </body>
    </html>
  );
}
