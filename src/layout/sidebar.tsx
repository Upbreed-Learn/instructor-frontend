import { Link, NavLink, useLocation, useNavigate } from 'react-router';
import logo from '../assets/upbreed-logo.svg';
import { cn } from '@/lib/utils';
import Cookies from 'js-cookie';
import DashboardIcon from '@/assets/jsx-icons/dashboard-icon';
import CalendarCheck from '@/assets/jsx-icons/calendar-check';
import Coin from '@/assets/jsx-icons/coin';
import UsersMore from '@/assets/jsx-icons/users-more';
import Logout from '@/assets/jsx-icons/logout';
import { Eye } from 'lucide-react';

const ROUTES = [
  {
    path: '/',
    label: 'Overview',
  },
  {
    path: '/courses',
    label: 'My Courses',
  },
  {
    path: '/insights',
    label: 'Audience Insights',
  },
  {
    path: '/earnings',
    label: 'Earnings',
  },
  {
    path: '/sessions',
    label: 'Personal Sessions',
  },
];

const Sidebar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <aside className="hide-scrollbar fixed flex h-screen w-max flex-col gap-16 overflow-auto bg-[#305B43] px-11 pt-16">
      <Link to={'/'} className="h-9 w-38.5">
        <img src={logo} alt="upbreed logo" className="size-full" />
      </Link>
      <div className="flex flex-col gap-30">
        <div className="flex flex-col gap-4">
          {ROUTES.map(route => (
            <NavLink
              key={route.path}
              to={route.path}
              className={({ isActive }) =>
                cn(
                  'group flex items-center gap-4 rounded-lg px-6 py-2 text-xs/[100%] font-semibold transition-colors hover:bg-white hover:text-[#737373]',
                  isActive ? 'bg-white text-[#737373]' : 'bg-none text-white',
                )
              }
            >
              {route.path === '/' && (
                <div className="grid-stack grid">
                  <DashboardIcon
                    className={cn(
                      'grid-area-stack transition-opacity',
                      pathname === '/' && 'opacity-100',
                      pathname !== '/' && 'group-hover:opacity-100!',
                    )}
                  />
                  <DashboardIcon
                    stroke={'white'}
                    className={cn(
                      'grid-area-stack transition-opacity',
                      pathname === '/' && 'opacity-0',
                      pathname !== '/' && 'group-hover:opacity-0!',
                    )}
                  />
                </div>
              )}
              {route.path.includes('courses') && (
                <div className="grid-stack grid">
                  <CalendarCheck
                    stroke={'#9B9B9B'}
                    className={cn(
                      'grid-area-stack transition-opacity',
                      pathname.includes('courses') && 'opacity-100',
                      !pathname.includes('courses') &&
                        'group-hover:opacity-100!',
                    )}
                  />
                  <CalendarCheck
                    className={cn(
                      'grid-area-stack transition-opacity',
                      pathname.includes('courses') && 'opacity-0',
                      !pathname.includes('courses') &&
                        'group-hover:opacity-0!',
                    )}
                  />
                </div>
              )}
              {route.path === '/insights' && (
                <div className="grid-stack grid">
                  <Eye
                    stroke={'#737373'}
                    className={cn(
                      'grid-area-stack transition-opacity',
                      pathname === '/insights' && 'opacity-100',
                      pathname !== '/insights' && 'group-hover:opacity-100!',
                    )}
                  />
                  <Eye
                    className={cn(
                      'grid-area-stack transition-opacity',
                      pathname === '/insights' && 'opacity-0',
                      pathname !== '/insights' && 'group-hover:opacity-0!',
                    )}
                  />
                </div>
              )}
              {route.path === '/earnings' && (
                <div className="grid-stack grid">
                  <Coin
                    stroke={'#737373'}
                    className={cn(
                      'grid-area-stack transition-opacity',
                      pathname === '/earnings' && 'opacity-100',
                      pathname !== '/earnings' && 'group-hover:opacity-100!',
                    )}
                  />
                  <Coin
                    className={cn(
                      'grid-area-stack transition-opacity',
                      pathname === '/earnings' && 'opacity-0',
                      pathname !== '/earnings' && 'group-hover:opacity-0!',
                    )}
                  />
                </div>
              )}
              {route.path === '/sessions' && (
                <div className="grid-stack grid">
                  <UsersMore
                    stroke={'#737373'}
                    className={cn(
                      'grid-area-stack transition-opacity',
                      pathname === '/sessions' && 'opacity-100',
                      pathname !== '/sessions' &&
                        'group-hover:opacity-100!',
                    )}
                  />
                  <UsersMore
                    className={cn(
                      'grid-area-stack transition-opacity',
                      pathname === '/sessions' && 'opacity-0',
                      pathname !== '/sessions' && 'group-hover:opacity-0!',
                    )}
                  />
                </div>
              )}
              {route.label}
            </NavLink>
          ))}
        </div>
        <div className="flex flex-col gap-4 px-6">
          <button
            onClick={() => {
              (Cookies.remove('rf'), navigate('/auth/login'));
            }}
            className="flex cursor-pointer items-center gap-4 text-xs/[100%] font-semibold text-white"
          >
            <Logout />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
