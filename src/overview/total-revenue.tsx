import RevenueChart from '@/components/charts/revenue';
import { cn } from '@/lib/utils';
interface DataPoint {
  month: string;
  usd: number;
  naira: number;
}

export default function TotalRevenueChart(props: {
  height?: number;
  className?: string;
}) {
  const { height = 120, className } = props;
  const data: DataPoint[] = [
    { month: 'Jan', usd: 25000, naira: 72000 },
    { month: 'Feb', usd: 35000, naira: 110000 },
    { month: 'Mar', usd: 32000, naira: 22000 },
    { month: 'Apr', usd: 28000, naira: 48000 },
    { month: 'May', usd: 38000, naira: 180000 },
    { month: 'Jun', usd: 430567, naira: 52000 },
    { month: 'Jul', usd: 42000, naira: 130000 },
    { month: 'Aug', usd: 35000, naira: 210000 },
    { month: 'Sept', usd: 48000, naira: 35000 },
    { month: 'Oct', usd: 52000, naira: 45657 },
    { month: 'Nov', usd: 50000, naira: 250000 },
    { month: 'Des', usd: 55000, naira: 270000 },
  ];

  return (
    <div
      className={cn(
        'w-full rounded-[5.5px] bg-white p-8 shadow-[0px_1.57px_1.57px_0px_#0000000A]',
        className,
      )}
    >
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-sm/[100%] font-bold text-[#464255]">
          Total Revenue
        </h2>
        <div className="flex gap-1.5">
          <div className="flex items-center gap-1">
            <div className="h-[7px] w-[7px] rounded-full bg-[#00230F]"></div>
            <span className="text-xs text-gray-500">USD</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-[7px] w-[7px] rounded-full bg-[#34A853]"></div>
            <span className="text-xs text-gray-500">NAIRA</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <RevenueChart data={data} height={height} />
    </div>
  );
}
