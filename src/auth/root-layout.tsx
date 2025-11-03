import { Link, Outlet } from 'react-router';
import { Toaster } from 'sonner';
import logo from '../assets/upbreed-logo.svg';

const AuthLayout = () => {
  return (
    <>
      <Toaster position="top-center" />
      <div className="flex h-screen items-center justify-center">
        <div className="flex w-full max-w-96 flex-col gap-14">
          <div className="flex flex-col gap-3">
            <Link to={'/'} className="h-[2.15rem] w-38.25">
              <img src={logo} alt="upbreed logo" className="size-full" />
            </Link>
            <h1 className="text-xs/5 font-semibold text-[#9B9B9B]">
              Instructor Dashboard
            </h1>
          </div>
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default AuthLayout;
