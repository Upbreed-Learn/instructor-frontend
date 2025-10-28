import { SearchInput } from '@/components/ui/custom/input';
import { CourseColumns } from './columns';
import ExportDropdown from '@/components/ui/custom/dropdown-menu';
import { MoreVertical } from 'lucide-react';
import PaginationSection from '@/components/ui/custom/pagination';
import { useState } from 'react';
import DataTable from '@/components/data-table';
import type { CourseDetailsType } from '@/lib/constants';
// import { useEffect, useState, type ChangeEvent } from 'react';
// import { useGetCourses, useGetSearchedCourses } from '@/queries/hooks';
// import ErrorState from '@/components/error';
// import { useQueryClient } from '@tanstack/react-query';
// import type { CourseDetailsType } from '@/lib/constants';
// import { useDebounce } from '@/lib/hooks/useDebounce';

const Courses = () => {
  // const dataSkeleton: CourseDetailsType[] = [];
  const data: CourseDetailsType[] = [];
  const [page, setPage] = useState(1);

  for (let i = 0; i < 10; i++) {
    data.push({
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

  // const queryClient = useQueryClient();

  // const coursesData: CourseDetailsType[] = data?.data?.data;

  // useEffect(() => {
  //   if (debouncedSearch.length > 0) {
  //     setActiveList(searchedCourses);
  //   } else {
  //     setActiveList(coursesData);
  //   }
  // }, [debouncedSearch, searchedCourses, coursesData]);

  // for (let i = 0; i < 10; i++) {
  //   dataSkeleton.push({
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

  return (
    <div className="flex flex-col gap-6">
      {/* <SearchInput value={search} onChange={e => handleChange(e)} /> */}
      <SearchInput />
      <div className="flex flex-col gap-3">
        <ExportDropdown className="self-end">
          <MoreVertical />
        </ExportDropdown>
        <div className="bg-[#A1A1A10F]">
          {/* {isError ? (
            <ErrorState
              onRetry={() =>
                queryClient.invalidateQueries({ queryKey: ['courses'] })
              }
            />
          ) : isPending ? (
            <DataTable data={dataSkeleton} columns={CourseColumnsSkeleton} />
          ) : (
            <DataTable data={activeList} columns={CourseColumns} />
          )} */}
          <DataTable data={data} columns={CourseColumns} />
        </div>
        {/* {coursesData && coursesData.length > 0 && ( */}
        <PaginationSection
          currentPage={page}
          setCurrentPage={setPage}
          // totalPages={data?.data?.metadata.lastPage}
        />
        {/* )} */}
      </div>
    </div>
  );
};

export default Courses;
