import StarIcon from '@/assets/jsx-icons/star';
import { Skeleton } from '@/components/ui/skeleton';
import type { ColumnDef } from '@tanstack/react-table';

export type InsightsType = {
  name: string;
  courseTitle: string;
  rating: string;
  time: string;
};

export const InsightColumns: ColumnDef<InsightsType>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const data = row.original;
      return <p className="font-semibold">{data.name}</p>;
    },
  },
  {
    accessorKey: 'courseTitle',
    header: 'Course Title',
  },
  {
    accessorKey: 'rating',
    header: 'Rating',
    cell: ({ row }) => {
      const data = row.original;
      console.log(data);
      return (
        <span className="flex items-center gap-0.5">
          <StarIcon fill="#FFC700" />
          <StarIcon fill="#FFC700" />
          <StarIcon fill="#FFC700" />
          <StarIcon fill="white" />
          <StarIcon fill="white" />
        </span>
      );
    },
  },
  {
    accessorKey: 'time',
    header: 'Time',
  },
];

export const InsightColumnsSkeleton: ColumnDef<InsightsType>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: () => {
      return <Skeleton className="h-4 w-16 rounded bg-[#DBDBDB]" />;
    },
  },
  {
    accessorKey: 'courseTitle',
    header: 'Course Title',
    cell: () => {
      return <Skeleton className="h-4 w-16 rounded bg-[#DBDBDB]" />;
    },
  },
  {
    accessorKey: 'rating',
    header: 'Rating',
    cell: () => {
      return <Skeleton className="h-4 w-16 rounded bg-[#DBDBDB]" />;
    },
  },
  {
    accessorKey: 'time',
    header: 'Time',
    cell: () => {
      return <Skeleton className="h-4 w-16 rounded bg-[#DBDBDB]" />;
    },
  },
];
