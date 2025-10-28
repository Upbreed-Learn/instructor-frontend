import { useEffect, type ChangeEvent, type ComponentProps } from 'react';
import { cn } from '@/lib/utils';
import type { ControllerRenderProps } from 'react-hook-form';
import { Label } from '../label';
import { Input } from '../input';
import { FormControl, FormItem, FormLabel, FormMessage } from '../form';
import { Search } from 'lucide-react';

interface TextInputProps extends ComponentProps<'input'> {
  field?: ControllerRenderProps<any, any>;
  validated?: boolean;
  label?: string;
  htmlFor?: string;
  containerClassName?: string;
}

const TextInput = (props: TextInputProps) => {
  const {
    field,
    validated,
    label,
    placeholder,
    type,
    disabled,
    id,
    htmlFor,
    className,
    containerClassName,
    onChange,
    value,
  } = props;

  useEffect(() => {
    if (validated && !field) {
      throw new Error(
        'Field and FieldState prop is required when validated is set to true',
      );
    }
  }, [validated, field]);

  if (!validated) {
    return (
      <div className={cn('', containerClassName)}>
        {label && <Label htmlFor={htmlFor}>{label}</Label>}
        <Input
          type={type}
          id={id}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(className)}
          onChange={onChange}
          value={value}
        />
      </div>
    );
  }

  return (
    <FormItem className={cn('', containerClassName)}>
      {label && <FormLabel className={cn('')}>{label}</FormLabel>}
      <FormControl>
        <Input
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'h-11 border-0 bg-[#D9D9D980] placeholder:text-[10px]',
            className,
          )}
          {...field}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

export default TextInput;

export const SearchInput = (props: {
  className?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  value?: string;
}) => {
  const { className, onChange, value } = props;
  return (
    <div className={cn('relative w-full max-w-111.5', className)}>
      <Input
        type="search"
        placeholder="Search"
        className="pl-9"
        value={value}
        onChange={onChange}
      />
      <Search className="absolute top-1/2 left-3 -translate-y-1/2" size={16} />
    </div>
  );
};
