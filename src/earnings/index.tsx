import { Button } from '@/components/ui/button';
import FinanceTabs from './tabs';
import { useQueryState } from 'nuqs';
import { ArrowLeftRight } from 'lucide-react';
import TotalRevenueChart from '@/overview/total-revenue';
import Coin from '@/assets/jsx-icons/coin';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { ReactNode } from 'react';

const Earnings = () => {
  const [currency, setCurrency] = useQueryState('currency', {
    defaultValue: 'NGN',
  });

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <FinanceTabs />
        <div className="flex flex-col gap-2">
          <Button className="items-center text-[#00230F]">
            Request Payout
            <Coin stroke="#00230F" />
          </Button>
          <EarningsDialog>
            <span className="text-[8px]/[100%] font-semibold text-[#00230F]">
              {' '}
              <span className="text-[#FF0000]">*</span> Payment are rolled out
              quarterly
            </span>
          </EarningsDialog>
        </div>
      </div>
      <div className="flex flex-col gap-2 self-end">
        <Button
          onClick={() =>
            setCurrency(value => (value === 'NGN' ? 'USD' : 'NGN'))
          }
          className="h-8 rounded-xl font-bold"
        >
          {currency === 'NGN' ? '₦' : '$'}
          <ArrowLeftRight />
        </Button>
      </div>
      <div className="flex items-center gap-7 rounded-lg pt-6.5 pb-9 shadow-[0px_2.03px_2.03px_0px_#0000000A]">
        <div className="flex basis-full flex-col gap-0.5">
          <p className="text-5xl/[100%] font-bold">N100.8K</p>
          <p className="text-end text-xs/[100%] font-semibold text-[#9C9C9C]">
            Payment Completed
          </p>
        </div>
        <div className="flex basis-full flex-col gap-0.5 border-x border-[#9B9B9B] py-6 pr-8 pl-14">
          <p className="text-5xl/[100%] font-bold">$23.4M</p>
          <p className="text-end text-xs/[100%] font-semibold text-[#9C9C9C]">
            Monthly Revenue
          </p>
        </div>
        <div className="flex basis-full flex-col gap-0.5 border-r border-[#9B9B9B] px-7 py-6">
          <p className="text-5xl/[100%] font-bold">N1B</p>
          <p className="text-xs/[100%] font-semibold text-[#9C9C9C]">
            Total revenue
          </p>
        </div>
        <div className="flex basis-full flex-col gap-0.5">
          <p className="text-5xl/[100%] font-bold">N2.5M</p>
          <p className="text-end text-xs/[100%] font-semibold text-[#9C9C9C]">
            Pending Payout
          </p>
        </div>
      </div>
      <TotalRevenueChart height={180} className="flex-2/3" />
    </div>
  );
};

export default Earnings;

export const EarningsDialog = (props: { children: ReactNode }) => {
  const { children } = props;
  return (
    <Dialog>
      <DialogTrigger className="cursor-pointer">{children}</DialogTrigger>
      <DialogContent className="bg-[#EFEFEF]">
        <DialogHeader className="sr-only">
          <DialogTitle>Payment Terms for UpbreedLearn</DialogTitle>
          <DialogDescription>
            Read more about the payment terms for UpbreedLearn
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 text-xs/4 font-medium">
          <p>Payment Terms for UpbreedLearn</p>
          <ol className="flex list-inside list-decimal flex-col gap-3">
            <li>
              Payment Schedule: Payments will be processed every three months on
              the 4th day of the first month of each quarterly period (January,
              April, July, and October).
            </li>{' '}
            <li>
              Payment Method: All payments will be made via bank transfer.
            </li>
            <li>
              Account Information: To ensure timely payments, recipients must
              provide accurate and up-to-date bank account details in their
              account settings.
            </li>{' '}
            <li>
              Responsibility: It is the recipient's responsibility to ensure
              that the provided bank account is valid and able to receive
              payments.
            </li>{' '}
            <li>
              Processing Timeline: Payments will be initiated on the stated
              date, and processing times may vary depending on the recipient's
              bank.
            </li>
          </ol>
        </div>
        <Button className="cursor-pointer border border-[#FF0000] bg-[#EBEBEB] hover:bg-[#EBEBEB]/80">
          Your payment cannot be processed now
        </Button>
        <Button className="cursor-pointer border border-[#D0EA50] bg-[#EBEBEB] hover:bg-[#EBEBEB]/80">
          Your payout has been processed
        </Button>
      </DialogContent>
    </Dialog>
  );
};
