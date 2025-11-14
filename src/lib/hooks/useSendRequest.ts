import { useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { toast } from 'sonner';

interface UsePostRequestProps<T, R> {
  mutationFn: (data: T) => Promise<R>;
  successToast?: { title: string; description: string };
  errorToast?: { title: string; description?: string };
  cookie?: { name: string; getValue: (data: R) => string };
  onSuccessCallback?: (data?: R) => void;
}

export const errorToastClassName =
  '!bg-[#FFFBFA] !border !border-[#FDA29B] !shadow-[0px_1px_2px_0px_#1018280D] [&_div]:!text-[#B42318] [&>div>div]:last:!font-light !text-sm !leading-5';

const successToastClassName =
  '!bg-[#F6FEF9] !border !border-[#75E0A7] [&_div]:!text-[#067647] !shadow-[0px_1px_2px_0px_#1018280D] [&>div>div]:last:!font-light !text-sm !leading-5';

const useSendRequest = <T, R>({
  mutationFn,
  successToast,
  errorToast,
  cookie,
  onSuccessCallback,
}: UsePostRequestProps<T, R>) => {
  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn,
    onSuccess: data => {
      if (cookie) {
        const cookieValue = cookie.getValue(data);
        if (cookieValue) {
          Cookies.set(cookie.name, cookieValue);
        }
      }
      if (successToast)
        toast.success(`${successToast?.title}`, {
          description: `${successToast?.description}`,
          className: successToastClassName,
        });
      onSuccessCallback && onSuccessCallback();
    },
    onError: (error: any) => {
      if (error.isAxiosError && error.response) {
        const errorMessage =
          error.response.data?.message || `${errorToast?.description}`;

        if (errorToast)
          toast.error(`${errorToast?.title}`, {
            description: errorMessage,
            className: errorToastClassName,
          });
      } else {
        if (errorToast)
          toast.error(`Error`, {
            description: 'An unexpected error occurred. Please try again.',
            className: errorToastClassName,
          });
      }
    },
  });

  return { mutate, isPending, isSuccess };
};

export default useSendRequest;
