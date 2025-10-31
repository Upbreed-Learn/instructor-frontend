import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import z from 'zod';
import { useForm } from '@tanstack/react-form';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useRef, useState } from 'react';
import ImageUploadIcon from '@/assets/jsx-icons/image-upload-icon';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  image: z
    .union([
      z.url('Must be a valid URL'),
      z
        .any()
        .refine(
          file =>
            !file ||
            (file instanceof File &&
              file.size <= 10 * 1024 * 1024 &&
              file.type.startsWith('image/')),
          { message: 'Please upload an image file not more than 10MB.' },
        ),
    ])
    .optional(),
  firstName: z.string().min(2, {
    message: 'First name must be at least 2 characters long.',
  }),
  lastName: z.string().min(2, {
    message: 'Last name must be at least 2 characters long.',
  }),
  accountName: z.string().min(2, {
    message: 'Account name must be at least 2 characters long.',
  }),
  accountNumber: z.string().min(2, {
    message: 'Account number must be at least 2 characters long.',
  }),
  bankName: z.string().min(2, {
    message: 'Bank name must be at least 2 characters long.',
  }),
  email: z.email({
    message: 'Please enter a valid email address.',
  }),
});

type UserFormValues = z.infer<typeof formSchema>;

const Settings = () => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      accountName: '',
      accountNumber: '',
      bankName: '',
      email: '',
    } as UserFormValues,
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      console.log(value);
      //   toast('You submitted the following values:', {
      //     description: (
      //       <pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
      //         <code>{JSON.stringify(value, null, 2)}</code>
      //       </pre>
      //     ),
      //     position: 'bottom-right',
      //     classNames: {
      //       content: 'flex flex-col gap-2',
      //     },
      //     style: {
      //       '--border-radius': 'calc(var(--radius)  + 4px)',
      //     } as React.CSSProperties,
      //   });
      // },
    },
  });

  return (
    <div className="flex flex-col items-center gap-6 pb-6">
      <Button className="w-max cursor-pointer self-start">
        <ArrowLeft />
        Back
      </Button>
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
            name="image"
            children={field => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field
                  className={cn(
                    'flex h-28 w-30 flex-col items-center justify-center gap-2 rounded-lg bg-[#D9D9D9] text-center',
                    isDragging && 'border-[#305B43] bg-[#e5e5e5]',
                  )}
                  data-invalid={isInvalid}
                  onDragOver={e => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={e => {
                    e.preventDefault();
                    setIsDragging(false);
                  }}
                  onDrop={e => {
                    e.preventDefault();
                    setIsDragging(false);
                    const file = e.dataTransfer.files[0];
                    if (
                      file &&
                      file.type.startsWith('image/') &&
                      file.size <= 10 * 1024 * 1024
                    ) {
                      field.handleChange(file);
                    }
                  }}
                  onClick={() => inputRef.current?.click()}
                >
                  <Input
                    ref={inputRef}
                    id={field.name}
                    name={field.name}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onBlur={field.handleBlur}
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (
                        file &&
                        file.type.startsWith('image/') &&
                        file.size <= 10 * 1024 * 1024
                      ) {
                        field.handleChange(file);
                      }
                    }}
                    aria-invalid={isInvalid}
                    autoComplete="off"
                  />
                  {field.state.value ? (
                    <img
                      src={
                        typeof field.state.value === 'string'
                          ? field.state.value
                          : URL.createObjectURL(field.state.value)
                      }
                      alt="uploaded"
                      className="size-full rounded object-cover"
                    />
                  ) : (
                    <>
                      <ImageUploadIcon />
                      <p className="text-[7px]/[100%] font-semibold text-[#9B9B9B]">
                        UPLOAD IMAGE
                      </p>
                    </>
                  )}
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <FieldSet>
            <FieldLegend className="text-xs/[100%] font-bold text-[#9C9C9C]">
              Personal Information
            </FieldLegend>
            <form.Field
              name="firstName"
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
                      placeholder="First Name"
                      autoComplete="off"
                      className="h-9 rounded-lg border-transparent bg-[#D9D9D980] placeholder:text-[#9B9B9B]"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
            <form.Field
              name="lastName"
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
                      placeholder="Last Name"
                      autoComplete="off"
                      className="h-9 rounded-lg border-transparent bg-[#D9D9D980] placeholder:text-[#9B9B9B]"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
          </FieldSet>
          <FieldSet>
            <FieldLegend className="text-xs/[100%] font-bold text-[#9C9C9C]">
              Account Details
            </FieldLegend>
            <form.Field
              name="accountName"
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
                      placeholder="Account Name"
                      autoComplete="off"
                      className="h-9 rounded-lg border-transparent bg-[#D9D9D980] placeholder:text-[#9B9B9B]"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
            <form.Field
              name="accountNumber"
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
                      placeholder="Account Number"
                      autoComplete="off"
                      className="h-9 rounded-lg border-transparent bg-[#D9D9D980] placeholder:text-[#9B9B9B]"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
            <form.Field
              name="bankName"
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
                      placeholder="Bank Name"
                      autoComplete="off"
                      className="h-9 rounded-lg border-transparent bg-[#D9D9D980] placeholder:text-[#9B9B9B]"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
          </FieldSet>
          <FieldSet>
            <FieldLegend className="text-xs/[100%] font-bold text-[#9C9C9C]">
              Reset your password
            </FieldLegend>
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
                      type="email"
                      aria-invalid={isInvalid}
                      placeholder="Email"
                      autoComplete="off"
                      className="h-9 rounded-lg border-transparent bg-[#D9D9D980] placeholder:text-[#9B9B9B]"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                    <FieldDescription className="text-xs/[100%] font-semibold text-black">
                      Enter your email and {`we’ll`} send you a link to reset
                      your password
                    </FieldDescription>
                    <button
                      type="button"
                      className="cursor-pointer text-end text-xs/[100%] text-[#7893EC] underline"
                    >
                      Send link to email
                      <span className="sr-only">Send link to email</span>
                    </button>
                  </Field>
                );
              }}
            />
          </FieldSet>
        </FieldGroup>
        <Button className="w-max self-end">Save</Button>
      </form>
    </div>
  );
};

export default Settings;
