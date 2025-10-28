import { Outlet, useLocation, useParams } from 'react-router';
import Sidebar from './sidebar';
import { cn } from '@/lib/utils';
// import 'prosemirror-view/style/prosemirror.css';
import { Toaster } from '@/components/ui/sonner';
import { Menu } from 'lucide-react';
import AvatarCustom from '@/components/ui/custom/avatar';

const RootLayout = () => {
  const { id } = useParams();
  const { pathname } = useLocation();

  return (
    <div className="flex">
      <Toaster />
      <Sidebar />
      <main className="ml-[15.58625rem] flex w-full justify-center">
        <div className="flex w-full max-w-240 flex-col">
          <div
            className={cn(
              'fixed z-20 flex w-240 gap-7 items-center justify-end bg-white pt-14',
              pathname.includes('blog/create') && 'hidden',
            )}
          >
            <p
              className={cn(
                'text-xs/[100%] font-bold text-[#737373]',
                id && 'hidden',
              )}
            >
              Hello, Winner Okorondudu
            </p>
            <Menu size={24}/>
            <AvatarCustom src={'https://github.com/shadcn.png'} alt='avatar' fallback='A' className='size-13.75'/>
          </div>
          <div
            className={cn(
              !pathname.includes('blog/create') ? 'mt-[7.225625rem]' : 'pt-7',
            )}
          >
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default RootLayout;
