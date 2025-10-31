import StarIcon from '@/assets/jsx-icons/star';
import type { ColumnDef } from '@tanstack/react-table';

type InsightsType = {
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
