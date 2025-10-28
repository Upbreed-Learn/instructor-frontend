import CourseIcon from '@/assets/jsx-icons/course-icon';
import DurationIcon from '@/assets/jsx-icons/duration-icon';
import InstructorIcon from '@/assets/jsx-icons/instructor-icon';
import LessonsIcon from '@/assets/jsx-icons/lessons-icon';
import ViewsIcon from '@/assets/jsx-icons/views-icon';
import AvatarCustom from '@/components/ui/custom/avatar';
// import { Skeleton } from '@/components/ui/skeleton';
import type { CourseDetailsType } from '@/lib/constants';
import type { ColumnDef } from '@tanstack/react-table';

// export interface CoursesType {
//   instructorImage: string;
//   courseTitle: string;
//   courseDuration: string;
//   instructorName: string;
//   lessons: string;
//   views: string;
// }

export const CourseColumns: ColumnDef<CourseDetailsType>[] = [
  {
    accessorKey: 'instructorImage',
    header: () => null,
    cell: ({ row }) => {
      const data = row.original;
      return (
        <AvatarCustom
          src={data.thumbnail}
          alt="Instructor Image"
          fallback={data.instructor.fname.charAt(0).toUpperCase()}
          className="h-11 w-11"
        />
      );
    },
  },
  {
    accessorKey: 'title',
    header: () => (
      <div className="flex items-center gap-1">
        <CourseIcon />
        <span className="text-[10px] font-semibold text-[#737373]">Title</span>
      </div>
    ),
  },
  {
    accessorKey: 'instructorName',
    header: () => (
      <div className="flex items-center gap-1">
        <InstructorIcon />
        <span className="text-[10px] font-semibold text-[#737373]">
          Instructor
        </span>
      </div>
    ),
    cell: ({ row }) => {
      const data = row.original;
      return (
        <p className="text-[10px] font-semibold text-[#D0EA50]">
          {data.instructor.fname} {data.instructor.lname}
        </p>
      );
    },
  },
  {
    accessorKey: 'preview.durationInMinutes',
    header: () => (
      <div className="flex items-center gap-1">
        <DurationIcon />
        <span className="text-[10px] font-semibold text-[#737373]">
          Duration
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'preview.lessonCount',
    header: () => (
      <div className="flex items-center gap-1">
        <LessonsIcon />
        <span className="text-[10px] font-semibold text-[#737373]">
          Lessons
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'views',
    header: () => (
      <div className="flex items-center gap-1">
        <ViewsIcon />
        <span className="text-[10px] font-semibold text-[#737373]">Views</span>
      </div>
    ),
    cell: () => {
      // const data = row.original;
      return (
        <div className="flex items-center gap-2.5">
          {/* <p>{data}</p> */}
          <p>0</p>
          <ViewsIcon fill="white" fill2="#FFFFFF40" />
        </div>
      );
    },
  },
];

// export const CourseColumnsSkeleton: ColumnDef<CourseDetailsType>[] = [
//   {
//     accessorKey: 'instructorImage',
//     header: () => null,
//     cell: () => {
//       return <Skeleton className="size-11 rounded bg-[#DBDBDB]" />;
//     },
//   },
//   {
//     accessorKey: 'courseTitle',
//     header: () => (
//       <div className="flex items-center gap-1">
//         <CourseIcon />
//         <span className="text-[10px] font-semibold text-[#737373]">Title</span>
//       </div>
//     ),
//     cell: () => {
//       return <Skeleton className="h-4 w-16 rounded bg-[#DBDBDB]" />;
//     },
//   },
//   {
//     accessorKey: 'instructorName',
//     header: () => (
//       <div className="flex items-center gap-1">
//         <InstructorIcon />
//         <span className="text-[10px] font-semibold text-[#737373]">
//           Instructor
//         </span>
//       </div>
//     ),
//     cell: () => {
//       return <Skeleton className="h-4 w-16 rounded bg-[#DBDBDB]" />;
//     },
//   },
//   {
//     accessorKey: 'courseDuration',
//     header: () => (
//       <div className="flex items-center gap-1">
//         <DurationIcon />
//         <span className="text-[10px] font-semibold text-[#737373]">
//           Duration
//         </span>
//       </div>
//     ),
//     cell: () => {
//       return <Skeleton className="h-4 w-16 rounded bg-[#DBDBDB]" />;
//     },
//   },
//   {
//     accessorKey: 'lessons',
//     header: () => (
//       <div className="flex items-center gap-1">
//         <LessonsIcon />
//         <span className="text-[10px] font-semibold text-[#737373]">
//           Lessons
//         </span>
//       </div>
//     ),
//     cell: () => {
//       return <Skeleton className="h-4 w-16 rounded bg-[#DBDBDB]" />;
//     },
//   },
//   {
//     accessorKey: 'views',
//     header: () => (
//       <div className="flex items-center gap-1">
//         <ViewsIcon />
//         <span className="text-[10px] font-semibold text-[#737373]">Views</span>
//       </div>
//     ),
//     cell: () => {
//       return <Skeleton className="h-4 w-16 rounded bg-[#DBDBDB]" />;
//     },
//   },
// ];
