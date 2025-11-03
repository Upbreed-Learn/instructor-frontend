import z from 'zod';
import { Button } from '@/components/ui/button';
import { LoaderPinwheelIcon } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Field, FieldError, FieldGroup } from '@/components/ui/field';
import { useForm } from '@tanstack/react-form';
import { Input } from '@/components/ui/input';
import useSendRequest from '@/lib/hooks/useSendRequest';
import { MUTATIONS } from '@/queries';
import { useUserEmailStore } from '@/store/user-email-control';

const formSchema = z.object({
  email: z.email({
    message: 'Please enter a valid email address.',
  }),
});

const ResetPassword = () => {
  const navigate = useNavigate();
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
      navigate('/auth/verify');
    },
  });

  const form = useForm({
    defaultValues: {
      email: '',
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      mutate({
        email: value.email,
        otpType: 'PASSWORD_RESET',
      });
      setUserEmail(value.email);
    },
  });

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <p className="text-[10px]/[100%] font-semibold text-[#00230F]">
          Request Verification Code
        </p>
      </div>
      <form
        id="settings-form"
        onSubmit={e => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="flex w-full max-w-117.25 flex-col gap-6"
      >
        <FieldGroup>
          <form.Field
            name="email"
            children={field => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={e => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    type="email"
                    placeholder="Email"
                    className="h-9 rounded-lg border-[#9B9B9B] bg-[#47474700] placeholder:text-[#9B9B9B]"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
        </FieldGroup>
        <Button disabled={isPending} type="submit">
          {isPending ? (
            <LoaderPinwheelIcon className="animate-spin" />
          ) : (
            'Send Verification Code'
          )}
        </Button>
      </form>
    </div>
  );
};

export default ResetPassword;
