"use client"
import { Sidebar } from '@/components/layout/sidebar';
import { usePathname } from 'next/navigation';

export function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Pages where sidebar should not be shown
  const noSidebarPages = ['/', '/signup', '/signin', '/sign-in', '/sign-up', '/login'];
  const shouldShowSidebar = !noSidebarPages.includes(pathname);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex">
        {shouldShowSidebar && <Sidebar />}
        <main className={`flex-1 overflow-y-auto ${!shouldShowSidebar ? 'w-full' : ''}`}>
          <div className="container-1 mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}