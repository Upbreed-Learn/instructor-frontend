import AvatarCustom from '@/components/ui/custom/avatar';
import { cn } from '@/lib/utils';
import { useUserIdStore } from '@/store/user-id-control';
import Cookies from 'js-cookie';
// import { Menu } from 'lucide-react';
import { useLocation } from 'react-router';
import { jwtDecode } from 'jwt-decode';
import { useEffect } from 'react';
import type { DecodedTokenType, UserDetailsType } from '@/lib/constants';
import { useGetUserDetails } from '@/queries/hooks';

const Navbar = () => {
  const { pathname } = useLocation();
  const { setUserId, userId } = useUserIdStore();
  const { data, isPending, isError } = useGetUserDetails(userId!!);
  const userDetails: UserDetailsType = data?.data?.data;

  useEffect(() => {
    const token = Cookies.get('rf');
    if (token) {
      const decodedToken = jwtDecode<DecodedTokenType>(token);
      setUserId(decodedToken.id);
    }
  }, []);

  return (
    <nav
      className={cn(
        'fixed z-20 flex w-240 items-center justify-end gap-7 bg-white pt-14',
        pathname.includes('settings') && 'hidden',
      )}
    >
      {isPending ? (
        <>
          <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
          <div className="size-6 animate-pulse rounded-full bg-gray-200" />
          <div className="size-13.75 animate-pulse rounded-full bg-gray-200" />
        </>
      ) : isError ? (
        <>
          <p className={cn('text-xs/[100%] font-bold text-red-500')}>
            Error loading user data
          </p>
          {/* <Menu size={24} className="text-gray-400" /> */}
          <AvatarCustom
            src=""
            alt="error"
            fallback="!"
            className="size-13.75 bg-red-100 text-red-500"
          />
        </>
      ) : (
        <>
          <p className={cn('text-xs/[100%] font-bold text-[#737373]')}>
            Hello, {userDetails.fname} {userDetails.lname}
          </p>
          {/* <Menu size={24} /> */}
          <AvatarCustom
            src={userDetails.instructorProfile.profilePictureUrl}
            alt="avatar"
            fallback={userDetails.fname.charAt(0).toUpperCase()}
            className="size-13.75"
          />
        </>
      )}
    </nav>
  );
};

export default Navbar;
