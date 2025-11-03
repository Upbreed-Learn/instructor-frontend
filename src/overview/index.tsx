import { Button } from '@/components/ui/button';
import TotalRevenueChart from './total-revenue';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';
import { ArrowLeftRight, MoreVertical } from 'lucide-react';
import { useQueryState } from 'nuqs';
import ExportDropdown from '@/components/ui/custom/dropdown-menu';
import ViewerGrowth from './viewer-growth';
import { useQuery } from '@tanstack/react-query';
import { QUERIES } from '@/queries';
import { useUserIdStore } from '@/store/user-id-control';
import type { DashboardDetailsType } from '@/lib/constants';

const useGetDashboardDetails = (id: string) => {
  return useQuery({
    queryKey: ['dashboardDetails'],
    queryFn: () => QUERIES.getDashboardDetails(id),
    enabled: !!id,
  });
};

const Overview = () => {
  const [currency, setCurrency] = useQueryState('currency', {
    defaultValue: 'NGN',
  });
  const { userId } = useUserIdStore();
  const { data, isPending, isError } = useGetDashboardDetails(userId!!);
  const dashboardDetails: DashboardDetailsType = data?.data;

  return (
    <div className="flex flex-col gap-1.5 pt-6 pb-6">
      <div className="flex items-center justify-end gap-3">
        <ExportDropdown className="self-end">
          <MoreVertical />
        </ExportDropdown>
        <Button
          onClick={() =>
            setCurrency(value => (value === 'NGN' ? 'USD' : 'NGN'))
          }
          className="_absolute _top-1.5 _right-2 h-8 rounded-xl font-bold"
        >
          {currency === 'NGN' ? '₦' : '$'}
          <ArrowLeftRight />
        </Button>
      </div>
      <div className="flex flex-col gap-3.5">
        {isError ? (
          <SummaryCardError />
        ) : (
          <div className="relative flex items-center gap-10">
            {isPending ? (
              Array(4)
                .fill(null)
                .map((_, i) => <LoadingSummaryCard key={i} />)
            ) : (
              <>
                <SummaryCard
                  title="Total Views"
                  value={`${dashboardDetails.totalViews}`}
                />
                <SummaryCard
                  title="Total Earnings"
                  value={`${dashboardDetails.earnings.totalEarning}`}
                />
                <SummaryCard
                  title="Active Courses"
                  value={`${dashboardDetails.activeCourses}`}
                />
                <SummaryCard
                  title="1-on-1 Sessions"
                  value={`${dashboardDetails.oneOnOneSessions.completed}`}
                />
              </>
            )}
          </div>
        )}

        <div className="flex items-stretch gap-3">
          <ViewerGrowth />
          <div className="flex basis-full gap-5">
            <div className="flex basis-full flex-col gap-2">
              <TotalRevenueChart height={160} />
              <Link
                to={'/finance'}
                className="self-end text-[8px]/[100%] font-semibold text-[#949494] underline"
              >
                Read more...
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;

const SummaryCard = (props: {
  title: string;
  value: string;
  className?: string;
}) => {
  const { title, value, className } = props;
  return (
    <div
      className={cn(
        'flex basis-full items-end gap-3 rounded-xl bg-[#305B43] py-4 pr-3 pl-5',
        className,
      )}
    >
      <div className="w-full text-end">
        <p className="text-4xl/[100%] font-semibold text-white">{value}</p>
        <p className="text-[8px]/[100%] text-[#D0EA50]">{title}</p>
      </div>
    </div>
  );
};

const LoadingSummaryCard = () => {
  return (
    <div
      className={cn(
        'flex basis-full items-end gap-3 rounded-xl bg-[#305B43]/50 py-4 pr-3 pl-5',
      )}
    >
      <div className="w-full text-end">
        <div className="mb-1 h-10 w-full animate-pulse rounded bg-white/20" />
        <div className="ml-auto h-3 w-1/2 animate-pulse self-end rounded bg-[#D0EA50]/20" />
      </div>
    </div>
  );
};

const SummaryCardError = () => {
  return (
    <div
      className={cn(
        'flex basis-full items-end gap-3 rounded-xl bg-red-100 py-4 pr-3 pl-5',
      )}
    >
      <div className="w-full text-end">
        <p className="text-4xl/[100%] font-semibold text-red-500">--</p>
        <p className="text-xs/[100%] text-red-400">Error loading data!</p>
      </div>
    </div>
  );
};
