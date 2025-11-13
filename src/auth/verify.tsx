import z from 'zod';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, LoaderPinwheelIcon } from 'lucide-react';
import { useReducer } from 'react';
import { useNavigate } from 'react-router';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field';
import { useForm } from '@tanstack/react-form';
import { Input } from '@/components/ui/input';
import useSendRequest from '@/lib/hooks/useSendRequest';
import { MUTATIONS } from '@/queries';
import { useUserEmailStore } from '@/store/user-email-control';
import { cn } from '@/lib/utils';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';

const formSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long.' })
      .regex(/[A-Z]/, {
        message: 'Password must contain at least one uppercase letter.',
      })
      .regex(/[a-z]/, {
        message: 'Password must contain at least one lowercase letter.',
      })
      .regex(/[0-9]/, { message: 'Password must contain at least one number.' })
      .regex(/[^A-Za-z0-9]/, {
        message: 'Password must contain at least one special character.',
      }),
    confirmPassword: z.string(),
    otp: z.string().min(5, {
      message: 'OTP must be at least 5 characters.',
    }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type PasswordViewState = {
  password: string;
  confirmPassword: string;
};

type Action = {
  type: keyof PasswordViewState;
};

export const passwordViewReducer = (
  state: PasswordViewState,
  action: Action,
): PasswordViewState => {
  const currentType = state[action.type];
  return {
    ...state,
    [action.type]: currentType === 'password' ? 'text' : 'password',
  };
};

const checks = [
  {
    key: 'length',
    label: 'At least 8 characters',
    ok: (pw: string) => (pw || '').length >= 8,
  },
  {
    key: 'upper',
    label: 'At least 1 uppercase letter',
    ok: (pw: string) => /[A-Z]/.test(pw || ''),
  },
  {
    key: 'lower',
    label: 'At least 1 lowercase letter',
    ok: (pw: string) => /[a-z]/.test(pw || ''),
  },
  {
    key: 'number',
    label: 'At least 1 number',
    ok: (pw: string) => /\d/.test(pw || ''),
  },
  {
    key: 'special',
    label: 'At least 1 special character',
    ok: (pw: string) => /[^A-Za-z0-9]/.test(pw || ''),
  },
];

const VerifyEmail = () => {
  const [passwordView, dispatch] = useReducer(passwordViewReducer, {
    password: 'password',
    confirmPassword: 'password',
  });

  const { userEmail } = useUserEmailStore();

  const navigate = useNavigate();

  const { mutate, isPending } = useSendRequest<
    { email: string; password: string; otp: string },
    any
  >({
    mutationFn: (data: { email: string; password: string; otp: string }) =>
      MUTATIONS.verifyEmail(data),
    errorToast: {
      title: 'Error',
      description: 'Authentication failed',
    },
    successToast: {
      title: 'Success',
      description: 'Password reset successfully!',
    },
    onSuccessCallback: () => {
      navigate('/');
    },
  });

  const form = useForm({
    defaultValues: {
      otp: '',
      password: '',
      confirmPassword: '',
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      mutate({
        email: userEmail!!,
        password: value.password,
        otp: value.otp,
      });
    },
  });

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <p className="text-sm/[100%] font-semibold text-[#00230F]">
          Reset Password
        </p>
      </div>
      <form
        id="reset-password"
        onSubmit={e => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="flex w-full max-w-117.25 flex-col gap-6"
      >
        <FieldGroup>
          <form.Field
            name="password"
            children={field => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid} className="">
                  <FieldLabel
                    htmlFor={field.name}
                    className="text-xs/[100%] font-semibold text-[#00230F]"
                  >
                    New Password
                  </FieldLabel>
                  <FieldSet className="relative">
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={e => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      type={passwordView.password}
                      placeholder="Password"
                      autoComplete="off"
                      className="h-9 rounded-lg border-[#9B9B9B] bg-[#47474700] placeholder:text-[#9B9B9B]"
                    />
                    <button
                      onClick={() => dispatch({ type: 'password' })}
                      type="button"
                      className="absolute top-1/2 right-4 w-max! -translate-y-1/2 cursor-pointer p-1"
                    >
                      {passwordView.password === 'password' ? (
                        <EyeOff size={16} className="text-[#BEBEBE]" />
                      ) : (
                        <Eye size={16} className="text-[#BEBEBE]" />
                      )}
                      <span className="sr-only">
                        {passwordView.password === 'password' ? 'Hide' : 'Show'}{' '}
                        Password
                      </span>
                    </button>
                  </FieldSet>
                  <ul
                    className="mt-1 flex flex-col gap-1 text-sm/5"
                    aria-live="polite"
                    role="list"
                  >
                    {checks.map(c => {
                      const passed = c.ok(field.state.value || '');
                      return (
                        <li key={c.key} className="flex items-center gap-2">
                          <span
                            className={cn(
                              'inline-flex h-4 w-4 items-center justify-center rounded-full text-xs',
                              passed
                                ? 'bg-[#083226] text-[#D0EA50]'
                                : 'bg-[#1F2933] text-[#8996A9]',
                            )}
                            aria-hidden
                          >
                            {passed ? '✓' : '•'}
                          </span>
                          <span
                            className={passed ? 'text-black' : 'text-[#8996A9]'}
                          >
                            {c.label}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <form.Field
            name="confirmPassword"
            children={field => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid} className="">
                  <FieldLabel
                    htmlFor={field.name}
                    className="text-xs/[100%] font-semibold text-[#00230F]"
                  >
                    Confirm New Password
                  </FieldLabel>
                  <FieldSet className="relative">
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={e => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      type={passwordView.confirmPassword}
                      placeholder="Confirm Password"
                      autoComplete="off"
                      className="h-9 rounded-lg border-[#9B9B9B] bg-[#47474700] placeholder:text-[#9B9B9B]"
                    />
                    <button
                      onClick={() => dispatch({ type: 'confirmPassword' })}
                      type="button"
                      className="absolute top-1/2 right-4 w-max! -translate-y-1/2 cursor-pointer p-1"
                    >
                      {passwordView.confirmPassword === 'password' ? (
                        <EyeOff size={16} className="text-[#BEBEBE]" />
                      ) : (
                        <Eye size={16} className="text-[#BEBEBE]" />
                      )}
                      <span className="sr-only">
                        {passwordView.confirmPassword === 'password'
                          ? 'Hide'
                          : 'Show'}{' '}
                        Password
                      </span>
                    </button>
                  </FieldSet>

                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <form.Field
            name="otp"
            children={field => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel
                    htmlFor={field.name}
                    className="text-xs/[100%] font-semibold text-[#00230F]"
                  >
                    OTP
                  </FieldLabel>
                  <InputOTP
                    maxLength={6}
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={e => field.handleChange(e)}
                    aria-invalid={isInvalid}
                  >
                    <InputOTPGroup className="w-full justify-center gap-3">
                      <InputOTPGroup className="basis-full">
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup className="basis-full">
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTPGroup>
                  </InputOTP>
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
            'Reset Password'
          )}
        </Button>
      </form>
    </div>
  );
};

export default VerifyEmail;
