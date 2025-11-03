import z from 'zod';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, LoaderPinwheelIcon } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Field, FieldError, FieldGroup, FieldSet } from '@/components/ui/field';
import { useForm } from '@tanstack/react-form';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import useSendRequest from '@/lib/hooks/useSendRequest';
import { MUTATIONS } from '@/queries';

const formSchema = z.object({
  email: z.email({
    message: 'Please enter a valid email address.',
  }),
  password: z.string().min(5, {
    message: 'Password must be at least 5 characters.',
  }),
});

const useDeviceFingerprint = () => {
  return useQuery({
    queryKey: ['deviceFingerprint'],
    queryFn: async () => {
      const fp = await FingerprintJS.load();
      const { visitorId } = await fp.get();
      return visitorId;
    },
    staleTime: Infinity,
  });
};
const Login = () => {
  const [viewPassword, setViewPassword] = useState(false);
  const { data: deviceFingerprint } = useDeviceFingerprint();
  const navigate = useNavigate();

  const handleTogglePassword = () => {
    setViewPassword(prev => !prev);
  };

  const { mutate, isPending } = useSendRequest<
    { email: string; password: string; deviceSignature: string },
    { data: { token: string } }
  >({
    mutationFn: (data: {
      email: string;
      password: string;
      deviceSignature: string;
    }) => MUTATIONS.authLogin(data),
    errorToast: {
      title: 'Error',
      description: 'Authentication failed',
    },
    cookie: {
      name: 'rf',
      getValue: response => response?.data?.token,
    },
    onSuccessCallback: () => {
      navigate('/');
    },
  });

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      mutate({
        email: value.email,
        password: value.password,
        deviceSignature: deviceFingerprint!!,
      });
    },
  });

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <p className="text-[10px]/[100%] font-semibold text-[#9B9B9B] uppercase">
          WELCOME BACK
        </p>
        <p className="text-[10px]/[100%] font-semibold text-[#00230F]">
          Login to Continue
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
          <form.Field
            name="password"
            children={field => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid} className="">
                  <FieldSet className="relative">
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={e => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      type={viewPassword ? 'text' : 'password'}
                      placeholder="Password"
                      autoComplete="off"
                      className="h-9 rounded-lg border-[#9B9B9B] bg-[#47474700] placeholder:text-[#9B9B9B]"
                    />
                    <button
                      onClick={handleTogglePassword}
                      type="button"
                      className="absolute top-1/2 right-4 w-max! -translate-y-1/2 cursor-pointer p-1"
                    >
                      {viewPassword ? (
                        <EyeOff size={16} className="text-[#BEBEBE]" />
                      ) : (
                        <Eye size={16} className="text-[#BEBEBE]" />
                      )}
                      <span className="sr-only">
                        {viewPassword ? 'Hide' : 'Show'} Password
                      </span>
                    </button>
                  </FieldSet>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
        </FieldGroup>
        <Link
          to={'/auth/reset-password'}
          className="text-xs/[100%] font-semibold text-[#00230F] underline"
        >
          Reset Password
        </Link>
        <Button disabled={isPending} type="submit">
          {isPending ? (
            <LoaderPinwheelIcon className="animate-spin" />
          ) : (
            'Login'
          )}
        </Button>
      </form>
    </div>
  );
};

export default Login;
