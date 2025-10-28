import { Button } from '@/components/ui/button';
import TotalRevenueChart from './total-revenue';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';
import { ArrowLeftRight, MoreVertical } from 'lucide-react';
import { useQueryState } from 'nuqs';
import ExportDropdown from '@/components/ui/custom/dropdown-menu';
import ViewerGrowth from './viewer-growth';

const Overview = () => {
  const [currency, setCurrency] = useQueryState('currency', {
    defaultValue: 'NGN',
  });

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
        <div className="relative flex items-center gap-10">
          <SummaryCard title="Total Views" value={'100K'} />
          <SummaryCard title="Total Earnings" value={'$1M'} />
          <SummaryCard title="Active Courses" value={'2'} />
          <SummaryCard title="1-on-1 Sessions" value={'10'} />
        </div>
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
