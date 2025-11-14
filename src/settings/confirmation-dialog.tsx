import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import useSendRequest from '@/lib/hooks/useSendRequest';
import { MUTATIONS } from '@/queries';
import { useUserEmailStore } from '@/store/user-email-control';
import Cookies from 'js-cookie';
import { type ReactNode } from 'react';
import { useNavigate } from 'react-router';

const ConfirmationDialog = (props: { children: ReactNode; email: string }) => {
  const { children, email } = props;
  const navigate = useNavigate();
  //   const [redirecting, setRedirecting] = useState(false);

  const { setUserEmail } = useUserEmailStore();

  const { mutate, isPending } = useSendRequest<
    {
      email: string;
      otpType: 'LOGIN' | 'PASSWORD_RESET' | 'ACCOUNT_VERIFICATION';
    },
    any
  >({
    mutationFn: (data: {
      email: string;
      otpType: 'LOGIN' | 'PASSWORD_RESET' | 'ACCOUNT_VERIFICATION';
    }) => MUTATIONS.requestOTP(data),
    errorToast: {
      title: 'Error',
      description: 'Request failed! Please try again.',
    },
    successToast: {
      title: 'Success',
      description: 'OTP sent successfully!',
    },
    onSuccessCallback: () => {
      Cookies.remove('rf');
      navigate('/auth/verify');
      setUserEmail(email);
    },
  });

  const handleRequestOTP = () => {
    mutate({
      email: email,
      otpType: 'PASSWORD_RESET',
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex flex-col gap-8 border">
        <DialogHeader className="sr-only">
          <DialogTitle>Confirm</DialogTitle>
          <DialogDescription>
            You're about Request an OTP to reset your password
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-7">
          <p className="text-center text-xs/4 font-semibold text-black">
            You're about to request an OTP to reset your password
          </p>
          <div className="flex justify-center gap-3">
            <Button
              onClick={() => handleRequestOTP()}
              disabled={isPending}
              className={
                'cursor-pointer transition-opacity disabled:cursor-not-allowed disabled:opacity-50'
              }
            >
              {isPending ? 'Sending OTP...' : 'Yes, Send OTP'}
            </Button>
            <DialogClose asChild>
              <Button className="cursor-pointer bg-transparent text-[#9C9C9C] hover:bg-transparent">
                No, Cancel
              </Button>
            </DialogClose>
          </div>
          {/* {redirecting && (
            <span className="text-center">
              Redirecting, please wait...
              <span className="sr-only"> Redirecting, please wait...</span>
            </span>
          )} */}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationDialog;
