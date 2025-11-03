import DataTable from '@/components/data-table';
import {
  InsightColumns,
  InsightColumnsSkeleton,
  type InsightsType,
} from './columns';
import ExportDropdown from '@/components/ui/custom/dropdown-menu';
import { MoreVertical } from 'lucide-react';
import SearchInput from '@/components/ui/custom/search-input';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERIES } from '@/queries';
import { useUserIdStore } from '@/store/user-id-control';
import ErrorState from '@/components/error';
import PaginationSection from '@/components/ui/custom/pagination';
import { useState } from 'react';

const useGetInsights = (id: string) => {
  return useQuery({
    queryKey: ['insights'],
    queryFn: () => QUERIES.getInsights(id),
    enabled: !!id,
  });
};

const Insights = () => {
  const [page, setPage] = useState(1);
  const { userId } = useUserIdStore();
  const { data, isPending, isError } = useGetInsights(userId!!);
  const insightsData: InsightsType[] = data?.data?.data;
  const skeletonData: InsightsType[] = [];
  const queryClient = useQueryClient();

  for (let i = 0; i < 10; i++) {
    skeletonData.push({
      name: 'Emmanuel',
      courseTitle: 'Selling Anything',
      rating: '4.5',
      time: '2 hours',
    });
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <SearchInput />
        <ExportDropdown>
          <MoreVertical />
        </ExportDropdown>
      </div>
      <div className="rounded-lg bg-[#D9D9D980] px-16 py-5">
        {isError ? (
          <ErrorState
            onRetry={() =>
              queryClient.invalidateQueries({ queryKey: ['insights'] })
            }
          />
        ) : isPending ? (
          <DataTable data={skeletonData} columns={InsightColumnsSkeleton} />
        ) : (
          <DataTable
            data={insightsData}
            className="h-10 border-b-0 bg-transparent text-[10px]/[100%] text-[#737373] even:bg-transparent hover:bg-transparent"
            headerClassName="font-semibold text-[#737373]"
            columns={InsightColumns}
          />
        )}
      </div>
      {insightsData && insightsData.length > 0 && (
        <PaginationSection
          currentPage={page}
          setCurrentPage={setPage}
          totalPages={data?.data?.metadata.lastPage}
        />
      )}
    </section>
  );
};

export default Insights;
