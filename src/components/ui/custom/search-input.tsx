import { cn } from '@/lib/utils';
import type { ChangeEvent } from 'react';
import { Input } from '../input';
import { Search } from 'lucide-react';

const SearchInput = (props: {
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

export default SearchInput;
