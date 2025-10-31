import DataTable from '@/components/data-table';
import { SearchInput } from '@/components/ui/custom/input';
import { InsightColumns } from './columns';
import ExportDropdown from '@/components/ui/custom/dropdown-menu';
import { MoreVertical } from 'lucide-react';

const Insights = () => {
  const data = [];

  for (let i = 0; i < 10; i++) {
    data.push({
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
        <DataTable
          data={data}
          className="h-10 border-b-0 bg-transparent text-[10px]/[100%] text-[#737373] even:bg-transparent hover:bg-transparent"
          headerClassName="font-semibold text-[#737373]"
          columns={InsightColumns}
        />
      </div>
    </section>
  );
};

export default Insights;
