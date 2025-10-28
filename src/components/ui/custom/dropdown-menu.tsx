import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../dropdown-menu';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '../button';
import ExportIcon from './export-icon';

const ExportDropdown = (props: { children: ReactNode; className?: string }) => {
  const { children, className } = props;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={cn('hover:border-none', className)}>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <Button
          asChild
          className="cursor-pointer self-end bg-white text-[8px]/3 font-bold text-[#6F6F6F] hover:bg-white focus-visible:border-none"
        >
          <DropdownMenuItem className="w-full">
            <ExportIcon />
            Save Report
          </DropdownMenuItem>
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportDropdown;
