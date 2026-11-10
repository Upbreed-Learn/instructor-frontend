import { Outlet, useLocation } from 'react-router';
import Sidebar from './sidebar';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/sonner';
import Navbar from './navbar';

const RootLayout = () => {
  const { pathname } = useLocation();

  return (
    <div className="flex">
      <Toaster />
      <Sidebar />
      <main className="ml-[17rem] flex w-full justify-center">
        <div className={cn('flex w-full flex-col', pathname === '/' ? 'max-w-[78rem] px-8' : 'max-w-240')}>
          {/* The overview carries its own header (name, photo, period); the navbar still loads who is signed in. */}
          <div className={cn(pathname === '/' && 'hidden')}>
            <Navbar />
          </div>
          <div
            className={cn(pathname === '/' ? '' : !pathname.includes('settings') ? 'mt-32' : 'pt-7')}
          >
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default RootLayout;
