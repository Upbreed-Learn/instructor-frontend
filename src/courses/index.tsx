import { CourseColumns, CourseColumnsSkeleton } from './columns';
import ExportDropdown from '@/components/ui/custom/dropdown-menu';
import { MoreVertical } from 'lucide-react';
import PaginationSection from '@/components/ui/custom/pagination';
import { useState } from 'react';
import DataTable from '@/components/data-table';
import type { CourseDetailsType } from '@/lib/constants';
import SearchInput from '@/components/ui/custom/search-input';
import { QUERIES } from '@/queries';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useUserIdStore } from '@/store/user-id-control';
import ErrorState from '@/components/error';
// import { useEffect, useState, type ChangeEvent } from 'react';
// import { useGetCourses, useGetSearchedCourses } from '@/queries/hooks';
// import { useDebounce } from '@/lib/hooks/useDebounce';

const useGetCourses = (id: string) => {
  return useQuery({
    queryKey: ['courses'],
    queryFn: () => QUERIES.getCourses(id),
    enabled: !!id,
  });
};

const Courses = () => {
  const [page, setPage] = useState(1);
  const { userId } = useUserIdStore();
  const { data, isPending, isError } = useGetCourses(userId!!);
  const coursesData: CourseDetailsType[] = data?.data?.data;
  const dataSkeleton: CourseDetailsType[] = [];
  const queryClient = useQueryClient();

  // const data: CourseDetailsType[] = [];

  // for (let i = 0; i < 10; i++) {
  //   data.push({
  //     thumbnail: 'https://i.pravatar.cc/150?img=1',
  //     title: 'Selling Anything',
  //     description:
  //       'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl eget ultrices ultricies, nunc nulla ultricies nisi, euismod ultrices nisl.',
  //     instructor: {
  //       fname: 'Michelle',
  //       lname: 'Elegbe',
  //     },
  //     categories: [
  //       {
  //         id: 1,
  //         name: 'Art & Culture',
  //       },
  //     ],
  //     preview: {
  //       lessonCount: 10,
  //       durationInMinutes: 60,
  //     },
  //     tags: [],
  //     videos: [],
  //     id: '1',
  //   });
  // }
  // const [search, setSearch] = useState('');
  // const [activeList, setActiveList] = useState<CourseDetailsType[]>([]);
  // const debouncedSearch = useDebounce(search.trim(), 1000);

  // const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
  //   setSearch(event.target.value);
  // };

  // const { data, isPending, isError } = useGetCourses(page);
  // const { data: searchedCoursesData } = useGetSearchedCourses(
  //   page,
  //   20,
  //   debouncedSearch,
  // );
  // const searchedCourses: CourseDetailsType[] = searchedCoursesData?.data?.data;

  // const coursesData: CourseDetailsType[] = data?.data?.data;

  // useEffect(() => {
  //   if (debouncedSearch.length > 0) {
  //     setActiveList(searchedCourses);
  //   } else {
  //     setActiveList(coursesData);
  //   }
  // }, [debouncedSearch, searchedCourses, coursesData]);

  for (let i = 0; i < 10; i++) {
    dataSkeleton.push({
      thumbnail: 'https://i.pravatar.cc/150?img=1',
      title: 'Selling Anything',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl eget ultrices ultricies, nunc nulla ultricies nisi, euismod ultrices nisl.',
      instructor: {
        fname: 'Michelle',
        lname: 'Elegbe',
      },
      categories: [
        {
          id: 1,
          name: 'Art & Culture',
        },
      ],
      preview: {
        lessonCount: 10,
        durationInMinutes: 60,
      },
      tags: [],
      videos: [],
      id: '1',
    });
  }

  return (
    <div className="flex flex-col gap-6">
      {/* <SearchInput value={search} onChange={e => handleChange(e)} /> */}
      <SearchInput />
      <div className="flex flex-col gap-3">
        <ExportDropdown className="self-end">
          <MoreVertical />
        </ExportDropdown>
        <div className="bg-[#A1A1A10F]">
          {isError ? (
            <ErrorState
              onRetry={() =>
                queryClient.invalidateQueries({ queryKey: ['courses'] })
              }
            />
          ) : isPending ? (
            <DataTable data={dataSkeleton} columns={CourseColumnsSkeleton} />
          ) : (
            <DataTable data={coursesData} columns={CourseColumns} />
          )}
        </div>
        {coursesData && coursesData.length > 0 && (
          <PaginationSection
            currentPage={page}
            setCurrentPage={setPage}
            totalPages={data?.data?.metadata.lastPage}
          />
        )}
      </div>
    </div>
  );
};

export default Courses;
