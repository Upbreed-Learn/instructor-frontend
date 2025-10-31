import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQueryState } from 'nuqs';

const FinanceTabs = () => {
  const [duration, setDuration] = useQueryState('duration', {
    defaultValue: '12-months',
  });

  console.log(duration);

  return (
    <Tabs
      defaultValue="12-months"
      onValueChange={value => setDuration(value)}
      className="w-[400px]"
    >
      <TabsList>
        <TabsTrigger value="12-months">12 Months</TabsTrigger>
        <TabsTrigger value="30-days">30 Days</TabsTrigger>
        <TabsTrigger value="7-days">7 Days</TabsTrigger>
        <TabsTrigger value="24-hrs">24 Hours</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default FinanceTabs;
