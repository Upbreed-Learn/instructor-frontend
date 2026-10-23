import RevenueChart from '@/components/charts/revenue';
import { cn } from '@/lib/utils';
import { useEarnings } from '@/lib/earnings';
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
  // Your 1-1 session earnings for the last 12 months (dollars and naira).
  const { data: earnings } = useEarnings();
  const data: DataPoint[] = (earnings?.history ?? []).map(h => ({
    month: new Date(`${h.month}-01T00:00:00Z`).toLocaleString(undefined, { month: 'short' }),
    usd: Number(h.USD ?? 0),
    naira: Number(h.NGN ?? 0),
  }));

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
          Your Earnings
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
