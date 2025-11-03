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
      <main className="ml-[15.58625rem] flex w-full justify-center">
        <div className="flex w-full max-w-240 flex-col">
          <Navbar />
          <div
            className={cn(!pathname.includes('settings') ? 'mt-32' : 'pt-7')}
          >
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default RootLayout;
